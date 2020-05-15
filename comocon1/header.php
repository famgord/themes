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
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/slick-theme.css?v=3">
	<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
	<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/script/slick.js?v=4"></script>
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php echo esc_url( get_bloginfo( 'pingback_url' ) ); ?>">
	<?php endif; ?>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
	<div class="main-center-block" style="position:relative">
		<div align="center" class="head-block">
			<?php the_custom_logo( $blog_id );?>
		   <div class="header-seo-block">
		      <div class="top-links">
		      	<div class="header-links news-block">
				<?php wp_nav_menu(array('theme_location' => 'header',
	    						'container_id'    => ''
	  			)); ?>
	  			</div>
		      </div>
		      <div class="header-links upper-block">
				<?php wp_nav_menu(array('theme_location' => 'header1',
	    						'container_id'    => ''
	  			)); ?>
		      </div>
		      <div class="header-links bottom-block">
				<?php wp_nav_menu(array('theme_location' => 'header2',
	    						'container_id'    => ''
	  			)); ?>
		      </div>
		   </div>
		</div>
