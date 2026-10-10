<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = strip_tags(trim($data["name"]));
    $email = filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($data["message"]));
    
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Please complete the form and try again."]);
        exit;
    }

    $recipient = "info@elevationsecuritygroup.co.uk";
    $subject = "New Inquiry from Elevation Security Group Website";
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    $email_headers = "From: $name <$email>";

    if (mail($recipient, $subject, $email_content, $email_headers)) {
        
        // --- Customer Confirmation Email ---
        $customer_subject = "Inquiry Received: Elevation Security Group";
        $customer_body = "Dear $name,\n\nThank you for reaching out to Elevation Security Group. This email is to confirm that we have received your inquiry.\n\nOur team is currently reviewing your details and will get back to you as soon as possible.\n\nSummary of your message:\n--------------------------\n$message\n--------------------------\n\nKind regards,\n\nElevation Security Group\ninfo@elevationsecuritygroup.co.uk";
        $customer_headers = "From: Elevation Security Group <info@elevationsecuritygroup.co.uk>";
        
        @mail($email, $customer_subject, $customer_body, $customer_headers);
        // ------------------------------------

        http_response_code(200);
        echo json_encode(["message" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Oops! Something went wrong and we couldn't send your message."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["message" => "There was a problem with your submission, please try again."]);
}
?>