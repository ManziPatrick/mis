import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface WelcomeEmailData {
  email: string;
  password: string;
  role: string;
  name?: string;
}

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  try {
    const { email, password, role, name } = data;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
    <h1 style="margin: 0; font-size: 24px;">Welcome to Our Platform!</h1>
    <p style="margin: 5px 0; font-size: 16px;">Your account has been successfully created</p>
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <p>Dear <strong>${name || "User"}</strong>,</p>
    <p>An administrator has created an account for you. Below are your login credentials:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 8px 0;"><strong>Password:</strong> ${password}</p>
      <p style="margin: 8px 0;"><strong>Role:</strong> ${role}</p>
      <p style="margin: 8px 0;"><strong>Platform:</strong> https://mis-fn.vercel.app/ </p>
    </div>
    <p style="margin: 10px 0;">For your security, we strongly recommend changing your password immediately after your first login.</p>
    <p>If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:support@mis.com" style="color: #4CAF50; text-decoration: none;">support@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p style="margin: 10px 0;">Stay connected with us:</p>
    <div style="margin: 10px 0;">
      <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendExpenseRequestEmail = async (data: {
  amount: number;
  description: string;
  requestedBy: string;
  adminEmails: string[];
  //financeEmails: string[];
}) => {
  const { amount, description, requestedBy, adminEmails } = data;
  const subject = "New Expense Request";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Expense Notification</h1>
    <p style="margin: 5px 0;">Automated Notification from MIS</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #4CAF50; margin-bottom: 10px;">New Expense Request</h2>
    <p style="margin: 10px 0;">A new expense request has been submitted. Here are the details:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0;">
      <p><strong>Amount:</strong> Rwf ${amount}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please review this request and take the necessary action at your earliest convenience.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #4CAF50;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
      <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendExpenseApprovalEmail = async (data: {
  amount: number;
  description: string;
  requestedBy: string;
  approvedBy: string;
  financeEmails: string[];
}) => {
  const { amount, description, requestedBy, approvedBy, financeEmails } = data;
  const subject = "Expense Request Approved";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Expense Notification</h1>
    <p style="margin: 5px 0;">Approval Confirmation from MIS</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #4CAF50; margin-bottom: 10px;">Expense Request Approved</h2>
    <p style="margin: 10px 0;">An expense request has been approved. Here are the details:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0;">
      <p><strong>Amount:</strong> Rwf ${amount}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
      <p><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please proceed with the necessary financial processing at your earliest convenience.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #4CAF50;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: financeEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendExpenseRejectionEmail = async (data: {
  amount: number;
  description: string;
  requestedBy: string;
  rejectedBy: string;
  financeEmails: string[];
}) => {
  const { amount, description, requestedBy, rejectedBy, financeEmails } = data;
  const subject = "Expense Request Rejected";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5733; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Expense Notification</h1>
    <p style="margin: 5px 0;">Rejection Notification from MIS</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #FF5733; margin-bottom: 10px;">Expense Request Rejected</h2>
    <p style="margin: 10px 0;">An expense request has been rejected. Here are the details:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5733; padding: 15px; margin: 15px 0;">
      <p><strong>Amount:</strong> Rwf ${amount}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
      <p><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please review the request and take necessary action as required.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #FF5733;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>

  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: financeEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookDeletionRequestEmail = async (data: {
  bookTitle: string;
  requestedBy: string;
  reason: string;
  adminEmails: string[];
}) => {
  const { bookTitle, requestedBy, reason, adminEmails } = data;
  const subject = "Book Deletion Request";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Book Deletion Notification</h1>
    <p style="margin: 5px 0;">Request to Delete a Book</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Book Deletion Request</h2>
    <p style="margin: 10px 0;">A request has been made to delete the following book:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Book Title:</strong> ${bookTitle}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
      <p><strong>Reason:</strong> ${reason}</p>
    </div>
    <p style="margin: 10px 0;">Please review this request and take appropriate action.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookDeletionApprovalEmail = async (data: {
  bookTitle: string;
  approvedBy: string;
  libraryEmails: string[];
}) => {
  const { bookTitle, approvedBy, libraryEmails } = data;
  const subject = "Book Deletion Request Approved";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Book Deletion Approved</h1>
    <p style="margin: 5px 0;">Your Request Has Been Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Request Approval</h2>
    <p style="margin: 10px 0;">Your request to delete the following book has been approved:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Book Title:</strong> ${bookTitle}</p>
      <p><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please proceed with the necessary library processing.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>

  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: libraryEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookDeletionRejectionEmail = async (data: {
  bookTitle: string;
  rejectedBy: string;
  libraryEmails: string[];
}) => {
  const { bookTitle, rejectedBy, libraryEmails } = data;
  const subject = "Book Deletion Request Rejected";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5A5F; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Book Deletion Request Rejected</h1>
    <p style="margin: 5px 0;">Your Request Could Not Be Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #FF5A5F; margin-bottom: 10px;">Request Status</h2>
    <p style="margin: 10px 0;">Your request to delete the following book has been rejected:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5A5F; padding: 15px; margin: 15px 0;">
      <p><strong>Book Title:</strong> ${bookTitle}</p>
      <p><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">If you have any questions or require further clarification, please contact the administrator at <a href="mailto:admin@mis.com" style="color: #FF5A5F;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #FF5A5F;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: libraryEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSupplierCreationEmail = async (data: {
  name: string;
  commodity: string;
  requestedBy: string;
  adminEmails: string[];
}) => {
  const { name, commodity, requestedBy, adminEmails } = data;
  const subject = "New Supplier Registration";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">New Supplier Registration</h1>
    <p style="margin: 5px 0; font-size: 16px;">A New Supplier Has Been Registered</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4CAF50; margin-bottom: 15px;">Supplier Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Supplier Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Commodity:</strong> ${commodity}</p>
      <p style="margin: 8px 0;"><strong>Requested by:</strong> ${requestedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please review and take necessary action on this registration. For assistance, contact us at <a href="mailto:admin@mis.com" style="color: #FF5A5F; text-decoration: none;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you are part of the MIS notification system. For any issues, please contact support at <a href="mailto:support@mis.com" style="color: #FF5A5F; text-decoration: none;">support@mis.com</a>.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSupplierApprovalEmail = async (data: {
  name: string;
  approvedBy: string;
  procurementEmails: string[];
}) => {
  const { name, approvedBy, procurementEmails } = data;
  const subject = "Supplier Registration Approved";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">Registration Approved</h1>
    <p style="margin: 5px 0; font-size: 16px;">Your Supplier Registration Has Been Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4CAF50; margin-bottom: 15px;">Approval Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Supplier Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">You can now proceed with your supplier activities. For assistance, contact us at <a href="mailto:admin@mis.com" style="color: #4CAF50; text-decoration: none;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you are part of the MIS notification system. For any issues, please contact support at <a href="mailto:support@mis.com" style="color: #4CAF50; text-decoration: none;">support@mis.com</a>.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: procurementEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSupplierRejectionEmail = async (data: {
  name: string;
  rejectedBy: string;
  procurementEmails: string[];
}) => {
  const { name, rejectedBy, procurementEmails } = data;
  const subject = "Supplier Registration Rejected";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5A5F; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">Registration Rejected</h1>
    <p style="margin: 5px 0; font-size: 16px;">Your Supplier Registration Has Been Rejected</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #FF5A5F; margin-bottom: 15px;">Rejection Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5A5F; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Supplier Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">If you have any questions or need further clarification, please contact our support team at <a href="mailto:support@mis.com" style="color: #FF5A5F; text-decoration: none;">support@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you applied for supplier registration in the MIS system. If this was an error, contact support.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: procurementEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUniformPurchaseEmail = async (data: {
  studentId: string;
  name: string;
  faculty: string;
  level: string;
  uniformType: {
    itemName: string;
    quantity: number;
  }[];
  amountPaid: number;
  storeEmails: string[];
}) => {
  const {
    studentId,
    name,
    faculty,
    level,
    uniformType,
    amountPaid,
    storeEmails,
  } = data;
  const subject = "Uniform Purchase Request";
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
    <!-- Header -->
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="margin: 0; font-size: 24px;">New Uniform Purchase Request</h1>
      <p style="margin: 5px 0; font-size: 16px;">A student has submitted a uniform purchase request</p>
    </div>

    <!-- Body -->
    <div style="padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
      <p>Student Details:</p>
      <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <p style="margin: 8px 0;"><strong>Student ID:</strong> ${studentId}</p>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0;"><strong>Faculty:</strong> ${faculty}</p>
        <p style="margin: 8px 0;"><strong>Level:</strong> ${level}</p>
      </div>

      <p>Uniform Items Requested:</p>
      <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0; border-radius: 4px;">
        ${uniformType
          .map(
            (item) => `
          <p style="margin: 8px 0;"><strong>${item.itemName}:</strong> ${item.quantity} pieces</p>
        `
          )
          .join("")}
        <p style="margin: 8px 0; font-weight: bold;"><strong>Amount Paid:</strong> Rwf ${amountPaid}</p>
      </div>

      <p style="margin: 10px 0;">Please process this request and prepare the uniform items for collection.</p>
      <p>If you have any questions or need clarification, please contact our support team at <a href="mailto:support@mis.com" style="color: #4CAF50; text-decoration: none;">support@mis.com</a>.</p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
      <p>You are receiving this email because you are registered as a store administrator in the MIS system.</p>
      <p style="margin: 10px 0;">Follow us on social media:</p>
      <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
        </a>
        <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
        </a>
        <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
        </a>
      </div>
      <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
    </div>
  </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: storeEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (data: {
  email: string;
  resetToken: string;
  names: string;
}): Promise<void> => {
  const { email, resetToken, names } = data;
  const subject = "Password Reset confirmation";
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
    <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
    <p style="margin: 5px 0; font-size: 16px;">You requested to reset your password</p>
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #ffffff;">
    <p>Hi <strong>${names}</strong>,</p>
    <p>We received a request to reset the password for your account associated with this email. If you made this request, you can reset your password by clicking the button below:</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.SERVER_URL_PRO}/auth/reset-password/${resetToken}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
    </div>
    
    <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
    <p style="word-break: break-word; background-color: #f9f9f9; padding: 10px; border-radius: 4px; border-left: 4px solid #4CAF50;">
    ${process.env.SERVER_URL_PRO}/auth/reset-password/${resetToken}</p>
    </p>
    <p style="margin: 10px 0;">
    If you didn't request to reset your password, please ignore this email. Your password will remain unchanged.</p>
    <p style="word-break: break-word;">If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@mis.com" style="color: #4CAF50; text-decoration: none;">support@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
      <p>You are receiving this email because you are registered as a store administrator in the MIS system.</p>
      <p style="margin: 10px 0;">Follow us on social media:</p>
      <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
        </a>
        <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
        </a>
        <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
        </a>
      </div>
      <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
    </div>
  </div>
  </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log("Reset email sent successfully");
  } catch (error) {
    console.log("Error for sending reset email", error);
  }
};

  export const sendOTPEmail = async (data: {
    email: string;
    otp: string;
    firstName: string;
  }): Promise<void> => {
    const { email, otp, firstName } = data;
    const subject = "One-Time Password (OTP)";
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
    <!-- Header -->
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="margin: 0; font-size: 24px;">One-Time Password (OTP)</h1>
      <p style="margin: 5px 0; font-size: 16px;">Your OTP for account verification</p>
    </div>

    <!-- Body -->
    <div style="padding: 20px; background-color: #ffffff;">
      <p>Hi <strong>${firstName || "User"}</strong>,</p>
      <p>Your OTP for account verification is: <strong>${otp}</strong></p>
      <p style="margin: 10px 0;">This OTP will expire in 5 minutes.</p>
      <p style="margin: 10px 0;">Please do not share this OTP with anyone. If you didn't request this OTP, please ignore this email.</p>
      <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto: Support@support.support" style="color: #4CAF50; text-decoration: none;">Support@support.support</a>.</p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
      <p>You are receiving this email because you are registered as a store administrator in the MIS system.</p>
      <p style="margin: 10px 0;">Follow us on social media:</p>
      <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
        </a>
        <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
        </a>
        <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
        </a>
      </div>
      <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
    </div>
  </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      //console.log("OTP email sent successfully");
    } catch (error) {
      console.log("Error for sending OTP email", error);
    }
};

export const sendEmployeeCreationEmail = async (data: {
  name: string;
  department: string;
  occupation: string;
  nationality: string;
  netSalary: number;
  requestedBy: string;
  adminEmails: string[];
}) => {
  const { 
    name,
    department,
    occupation,
    nationality,
    netSalary,
    requestedBy, 
    adminEmails
  } = data;
  const subject = "New Employee Registration";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">New Employee Registration</h1>
    <p style="margin: 5px 0; font-size: 16px;">A New Employee Has Been Registered</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4CAF50; margin-bottom: 15px;">Supplier Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Employee Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Department:</strong> ${department}</p>
      <p style="margin: 8px 0;"><strong>Occupation:</strong> ${occupation}</p>
      <p style="margin: 8px 0;"><strong>Nationality:</strong> ${nationality}</p>
      <p style="margin: 8px 0;"><strong>Net Salary:</strong> Rwf ${netSalary}</p>
      <p style="margin: 8px 0;"><strong>Requested by:</strong> ${requestedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please review and take necessary action on this registration. For assistance, contact us at <a href="mailto:admin@mis.com" style="color: #FF5A5F; text-decoration: none;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you are part of the MIS notification system. For any issues, please contact support at <a href="mailto:support@mis.com" style="color: #FF5A5F; text-decoration: none;">support@mis.com</a>.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmployeeApprovalEmail = async (data: {
  name: string;
  approvedBy: string;
  hrEmails: string[];
}) => {
  const { name, approvedBy, hrEmails } = data;
  const subject = "Employee Registration Approved";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">Registration Approved</h1>
    <p style="margin: 5px 0; font-size: 16px;">Your Employee Registration Has Been Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4CAF50; margin-bottom: 15px;">Approval Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Employee Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">You can now proceed with your employee activities. For assistance, contact us at <a href="mailto:admin@mis.com" style="color: #4CAF50; text-decoration: none;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you are part of the MIS notification system. For any issues, please contact support at <a href="mailto:support@mis.com" style="color: #4CAF50; text-decoration: none;">support@mis.com</a>.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hrEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmployeeRejectionEmail = async (data: {
  name: string;
  rejectedBy: string;
  hrEmails: string[];
}) => {
  const { name, rejectedBy, hrEmails } = data;
  const subject = "Employee Registration Rejected";
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5A5F; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">Registration Rejected</h1>
    <p style="margin: 5px 0; font-size: 16px;">Your Employee Registration Has Been Rejected</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #FF5A5F; margin-bottom: 15px;">Rejection Details</h2>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5A5F; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="margin: 8px 0;"><strong>Employee Name:</strong> ${name}</p>
      <p style="margin: 8px 0;"><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">If you have any questions or need further clarification, please contact our support team at <a href="mailto:support@mis.com" style="color: #FF5A5F; text-decoration: none;">support@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 14px; color: #777;">
    <p>You are receiving this email because you applied for supplier registration in the MIS system. If this was an error, contact support.</p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hrEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmployeeDeletionRequestEmail = async (data: {
  name: string;
  requestedBy: string;
  reason: string;
  adminEmails: string[];
}) => {
  const { name, requestedBy, reason, adminEmails } = data;
  const subject = "Employee Deletion Request";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Employee Deletion Notification</h1>
    <p style="margin: 5px 0;">Request to Delete an employee</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Book Deletion Request</h2>
    <p style="margin: 10px 0;">A request has been made to delete the following book:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
      <p><strong>Reason:</strong> ${reason}</p>
    </div>
    <p style="margin: 10px 0;">Please review this request and take appropriate action.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmployeeDeletionApprovalEmail = async (data: {
  name: string;
  approvedBy: string;
  hrEmails: string[];
}) => {
  const { name, approvedBy, hrEmails } = data;
  const subject = "Employee Deletion Request Approved";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Employee Deletion Approved</h1>
    <p style="margin: 5px 0;">Your Request Has Been Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Request Approval</h2>
    <p style="margin: 10px 0;">Your request to delete the following employee has been approved:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please proceed with the necessary processing actions.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>

  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hrEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmployeeDeletionRejectionEmail = async (data: {
  name: string;
  rejectedBy: string;
  hrEmails: string[];
}) => {
  const { name, rejectedBy, hrEmails } = data;
  const subject = "Employee Deletion Request Rejected";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5A5F; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Employee Deletion Request Rejected</h1>
    <p style="margin: 5px 0;">Your Request Could Not Be Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #FF5A5F; margin-bottom: 10px;">Request Status</h2>
    <p style="margin: 10px 0;">Your request to delete the following employee has been rejected:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5A5F; padding: 15px; margin: 15px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">If you have any questions or require further clarification, please contact the administrator at <a href="mailto:admin@mis.com" style="color: #FF5A5F;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #FF5A5F;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hrEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUpdateUniformRequestEmail = async (data: {
  itemName: string;
  quantity: number;
  requestedBy: string;
  adminEmails: string[];
}) => {
  const { itemName, quantity, requestedBy, adminEmails } = data;
  const subject = "Update Uniform Request";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Update Uniform Request Notification</h1>
    <p style="margin: 5px 0;">Request to Update Uniform</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Update Uniform Request</h2>
    <p style="margin: 10px 0;">A request has been made to Update Uniform</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Item Name:</strong> ${itemName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Requested by:</strong> ${requestedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please review this request and take appropriate action.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUpdateUniformApprovalEmail = async (data: {
  itemName: string;
  quantity: number;
  approvedBy: string;
  stockEmails: string[];
}) => {
  const { itemName, quantity, approvedBy, stockEmails } = data;
  const subject = "Update Uniform Request Approved";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #3B5998; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Update Uniform Request Approved</h1>
    <p style="margin: 5px 0;">Your Request Has Been Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #3B5998; margin-bottom: 10px;">Request Approval</h2>
    <p style="margin: 10px 0;">Your request to update the following uniform has been approved:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #3B5998; padding: 15px; margin: 15px 0;">
      <p><strong>Item Name:</strong> ${itemName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Approved by:</strong> ${approvedBy}</p>
    </div>
    <p style="margin: 10px 0;">Please proceed with the necessary processing actions.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: stockEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

export const sendUpdateUniformRejectionEmail = async (data: {
  itemName: string;
  quantity: number;
  rejectedBy: string;
  stockEmails: string[];
}) => {
  const { itemName, quantity, rejectedBy, stockEmails } = data;
  const subject = "Update Uniform Request Rejected";
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #FF5A5F; color: white; padding: 15px; text-align: center;">
    <h1 style="margin: 0;">Update Uniform Request Rejected</h1>
    <p style="margin: 5px 0;">Your Request Could Not Be Approved</p>
  </div>

  <!-- Body -->
  <div style="margin: 20px 0;">
    <h2 style="color: #FF5A5F; margin-bottom: 10px;">Request Status</h2>
    <p style="margin: 10px 0;">Your request to update the following uniform has been rejected:</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5A5F; padding: 15px; margin: 15px 0;">
      <p><strong>Item Name:</strong> ${itemName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Rejected by:</strong> ${rejectedBy}</p>
    </div>
    <p style="margin: 10px 0;">If you have any questions or require further clarification, please contact the administrator at <a href="mailto:admin@mis.com" style="color: #FF5A5F;">admin@mis.com</a>.</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      You are receiving this email because you are part of the MIS notification system. If you have questions, 
      please contact us at <a href="mailto:support@mis.com" style="color: #3B5998;">support@mis.com</a>.
    </p>
    <p style="margin: 10px 0;">Follow us on social media:</p>
    <div style="margin: 10px 0;">
        <a href="https://facebook.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 20px; height: 20px;">
  </a>
  <a href="https://twitter.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;">
  </a>
  <a href="https://linkedin.com" style="margin: 0 10px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 20px; height: 20px;">
  </a>
    </div>
    <p style="font-size: 12px; color: #999;">&copy; 2025 MIS. All rights reserved.</p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: stockEmails,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}