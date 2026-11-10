<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, max-age=0');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['message'=>'Method not allowed.']); exit; }
if (!empty($_POST['website'])) { http_response_code(200); echo json_encode(['message'=>'Thank you. Your enquiry has been received.']); exit; }
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();
$now = time();
if (isset($_SESSION['last_enquiry']) && ($now - (int)$_SESSION['last_enquiry']) < 20) { http_response_code(429); echo json_encode(['message'=>'Please wait a moment before sending another enquiry.']); exit; }
$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
if ($name === '' || mb_strlen($name) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 180 || $message === '' || mb_strlen($message) > 5000) { http_response_code(400); echo json_encode(['message'=>'Please check your details and try again.']); exit; }
$name = preg_replace('/[\r\n]+/', ' ', strip_tags($name));
$subject = 'New website enquiry — Elevation Security Group';
$body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = "From: Elevation Security Group <info@elevationsecuritygroup.co.uk>\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8";
if (!mail('info@elevationsecuritygroup.co.uk', $subject, $body, $headers)) { http_response_code(500); echo json_encode(['message'=>'We could not send your enquiry just now. Please email info@elevationsecuritygroup.co.uk.']); exit; }
$_SESSION['last_enquiry'] = $now;
http_response_code(200);
echo json_encode(['message'=>'Thank you. Your enquiry has been sent. We will be in touch.']);
