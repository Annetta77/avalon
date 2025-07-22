<?php
$emailFrom = "1@mail.ru";
$emailTo = "2@mail.ru";
// Получаем данные из POST-запроса
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptcha_secret = '6Le97YkrAAAAAEZ3_1_NdWXpSiOVWjoDna0ZY-PR';
    $recaptcha_response = $_POST['recaptcha_response'];
    $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
    $recaptcha = json_decode($recaptcha);

    if ($recaptcha->score > 0.5) {
		$name = htmlspecialchars($_POST['name']);
		$phone = htmlspecialchars($_POST['phone']);
		$service = htmlspecialchars($_POST['service']);
		$message = htmlspecialchars($_POST['message']);
		$subject = "Заявка с сайта lvs-expert.ru";

		// Формируем тело письма
		$body = "Имя: $name\nТелефон: $phone\nУслуга: $service\nКомментарий:\n$message\n";

		// Заголовки
		$headers = 'MIME-Version: 1.1' . PHP_EOL;
		$headers .= 'Content-type: text/html; charset=UTF-8' . PHP_EOL;
	    $headers .= "From: LVS <$emailFrom>" . PHP_EOL;
	    $headers .= "Return-Path: $emailFrom" . PHP_EOL;
	    $headers .= "Reply-To: $emailFrom" . PHP_EOL;
		$headers .= "X-Mailer: PHP/" . phpversion() . PHP_EOL;

		// Отправляем письмо
		$send_email = mail($emailTo, "=?UTF-8?B?" . Base64_encode($subject) . "?=", $body, $headers);

		echo ($send_email) ? 'success' : 'error';
	} else {
		echo 'error';
	}	
}
?>