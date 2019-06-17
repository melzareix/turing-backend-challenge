/**
 * SendGrid Helper to email the order details.
 */
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default (orderId, customer) => {
  const msg = {
    to: customer.email,
    from: 'mohamedelzarei@gmail.com',
    subject: `Order: ${orderId} From Shopmate`,
    text: `Your order order ${orderId} is confirmed and is on its way!.`
  };
  sgMail.send(msg);
};
