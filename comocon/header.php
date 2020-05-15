<?php
/**
 * Шаблон comocon.net
 *
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css?v=15">
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/slick.css">
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/slick-theme.css?v=5">
	<!-- <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/> -->
	<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
	<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
	<!-- <script src="<?php echo get_template_directory_uri(); ?>/script/scripts.min.js"></script> -->
	<script src="<?php echo get_template_directory_uri(); ?>/script/slick.js?v=4"></script>
	<!-- <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"> -->
  <!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script> -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.js"></script>  

	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php echo esc_url( get_bloginfo( 'pingback_url' ) ); ?>">
	<?php endif; ?>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
	<div id="page" class="site">
		<div class="site-inner">
			<div class="header">
	   <div class="wrap">
	      <div class="top">
         	<?php the_custom_logo( $blog_id );?>
	         <ul class="user-panel">
	            <li style="overflow:visible">
	               <div class="title">Войти через:</div>
	               <div id="uLogin" data-ulogin="display=panel;theme=flat;fields=first_name,last_name,email;providers=vkontakte,odnoklassniki,mailru,facebook,googleplus;hidden=other;redirect_uri=;callback=doULogin" style="position: relative;" data-ulogin-inited="1588088196994">
	                  <div class="ulogin-buttons-container" style="margin: 0px; padding: 0px; outline: none; border: none; border-radius: 0px; cursor: default; float: none; position: relative; display: inline-block; width: 252px; height: 32px; left: 0px; top: 0px; box-sizing: content-box; max-width: 100%; vertical-align: top; line-height: 0;">

	                  </div>
	                  <div style="margin: 0px; padding: 0px; outline: none; border-width: 5px; border-style: solid; border-color: transparent transparent rgb(102, 102, 102); border-image: initial; border-radius: 0px; cursor: default; float: none; position: absolute; display: none; width: 0px; height: 0px; left: 0px; top: 0px; box-sizing: content-box; z-index: 9999;"></div>
	               </div>
	            </li>
	            <li>
	               <div id="auth" class="login">
	                  <form>
	                     <div class="fields-group" style="float:right"><input type="password" name="password" placeholder="Пароль" required=""><i class="fa fa-unlock-alt" aria-hidden="true"></i></div>
	                     <div class="fields-group" style="margin-right: 10px;float:right"><input type="text" name="login" placeholder="Логин" required=""><i class="fa fa-user" aria-hidden="true"></i></div>
	                     <div>
	                        <div class="fields-group"><input type="hidden" name="csrf_hash" value="3ec533f5ae058f9e91d04b2d5353c335512bf7db"><button type="submit" class="login btn ripple small">Вход</button></div>
	                        <div class="fields-group"><a class="btn ripple inverse blue small" href="#" data-reveal-id="regPopup">Регистрация</a></div>
	                        <div class="fields-group forgot"><a href="#" data-reveal-id="remindPopup">Забыли пароль?</a></div>
	                     </div>
	                  </form>
	               </div>
	            </li>
	         </ul>
	         <div id="logPopup" class="reveal-modal">
	            <i class="fa fa-times-circle close-reveal-modal" aria-hidden="true"></i>
	            <div id="auth">
	               <div class="h1">Авторизация</div>
	               <form>
	                  <div class="fields-group"><input type="text" name="login" placeholder="Имя пользователя" required=""><i class="fa fa-user" aria-hidden="true"></i></div>
	                  <div class="fields-group"><input type="password" name="password" placeholder="Пароль" required=""><i class="fa fa-unlock-alt" aria-hidden="true"></i></div>
	                  <div class="fields-group forgot" style="margin-bottom: 10px;"><a href="#" data-reveal-id="remindPopup">Забыли пароль?</a></div>
	                  <div class="fields-group"><button type="submit" class="btn ripple blue inverse">Вход</button></div>
	               </form>
	            </div>
	         </div>
	         <div id="regPopup" class="reveal-modal">
	            <i class="fa fa-times-circle close-reveal-modal" aria-hidden="true"></i>
	            <div id="auth">
	               <div class="h1">Регистрация</div>
	            </div>
	         </div>
	      </div>
	   </div>
	</div>
	<div class="nav-outer">
	   <div class="wrap">
	    <?php wp_nav_menu(array('theme_location' => 'header',
	    						'container_id'    => '',
	    						'menu_class'      => 'nav'
	  	)); ?>
	   </div>
	</div>
	<div id="content" class="site-content">
