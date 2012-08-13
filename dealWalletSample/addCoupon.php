<?php header('content-type: application/json; charset=utf-8');
//place holder data to support plugin development	
	if(isset($_GET['code']))
	{
		$code = $_GET['code'];
	} else {
		$code = '';
	}
	switch($code){
		case '5dollar':
			$name = '$5 Dollars Off';
			$details = 'get 5 Dollars off your next purchase.';
			break;
		case '10dollar':
			$name = '$10 Dollars Off';
			$details = 'get 10 Dollars off your next purchase.';
			break;
		case '10percent':
			$name = '10% Off';
			$details = 'get 10% off your next purchase.';
			break;
		case '25percent':
			$name = '25% Off';
			$details = 'get 25% off your next purchase.';
			break;
	 	default:
			$name = '';
			$details = '';
			break;
	}
	if($name == '' && $details == '')
	{
		$error = array(
			'error' => 'Invalid Coupon Code'
		);
		echo json_encode($error);
	} else {
		$coupon = array(
			'name' => $name,
			'details'=> $details
		);
		echo json_encode($coupon);
	}
?>