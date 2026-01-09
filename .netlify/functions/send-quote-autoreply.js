/**
 * Netlify Serverless Function: Send Quote Auto-Reply Email via Brevo
 * 
 * This function is triggered by Netlify Forms when a quote-request form is submitted.
 * It sends a transactional email to the customer using Brevo template ID 2.
 * 
 * Setup Instructions:
 * 1. Set BREVO_API_KEY environment variable in Netlify Dashboard
 *    Site settings > Environment variables > Add variable
 *    Key: BREVO_API_KEY
 *    Value: Your Brevo API key (v3)
 * 
 * 2. Configure this function as a form notification:
 *    Netlify Dashboard > Forms > Form notifications > Add notification
 *    Notification type: Outgoing webhook
 *    URL: /.netlify/functions/send-quote-autoreply
 *    Form name: quote-request
 * 
 * 3. Ensure Brevo template ID 2 is active and configured
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    // Parse the form submission data from Netlify
    const formData = JSON.parse(event.body || '{}');
    
    // Verify this is from the quote-request form
    if (formData.form_name !== 'quote-request') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form name. Expected "quote-request".' })
      };
    }

    // Extract email and other form fields
    const recipientEmail = formData.email || formData.data?.email;
    const recipientName = formData.name || formData.data?.name || '';
    const serviceType = formData['service-type'] || formData.data?.['service-type'] || '';

    // Validate required fields
    if (!recipientEmail) {
      console.error('Missing email field in form submission');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email field is required.' })
      };
    }

    // Get Brevo API key from environment variable
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error: Brevo API key not found.' })
      };
    }

    // Prepare email data for Brevo API v3
    // Using template ID 2 as specified
    const emailData = {
      templateId: 2,
      to: [
        {
          email: recipientEmail,
          name: recipientName || recipientEmail
        }
      ],
      params: {
        name: recipientName || 'Valued Customer',
        email: recipientEmail,
        'service-type': serviceType || 'Service Inquiry'
      }
    };

    // Send transactional email via Brevo API v3
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    // Check if Brevo API call was successful
    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', brevoResponse.status, errorData);
      return {
        statusCode: brevoResponse.status,
        body: JSON.stringify({ 
          error: 'Failed to send email via Brevo.',
          details: errorData 
        })
      };
    }

    const brevoResult = await brevoResponse.json();
    
    // Log success (messageId is returned by Brevo API)
    console.log('Auto-reply email sent successfully:', {
      messageId: brevoResult.messageId,
      recipient: recipientEmail,
      templateId: 2
    });

    // Return success response (HTTP 200)
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Auto-reply email sent successfully.',
        messageId: brevoResult.messageId,
        recipient: recipientEmail,
        templateId: 2
      })
    };

  } catch (error) {
    // Log error for debugging
    console.error('Error in send-quote-autoreply function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

