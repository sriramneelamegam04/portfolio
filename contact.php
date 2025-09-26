<?php
header('Content-Type: text/html; charset=utf-8');
// Very small contact endpoint for demo. Replace mail() with your SMTP/mailer in production.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Method Not Allowed';
  exit;
}
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
if (!$name || !$email || !$message) {
  http_response_code(400);
  echo 'Please provide name, email and message.';
  exit;
}
$to = 'you@example.com'; // <- replace
$subject = 'Portfolio contact from ' . $name;
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
$headers = 'From: ' . $email . '\r\n' . 'Reply-To: ' . $email;
$ok = @mail($to, $subject, $body, $headers);
if ($ok) {
  echo 'Message sent. Thank you.';
} else {
  http_response_code(500);
  echo 'Failed to send message. Configure SMTP on the server.';
}
?>