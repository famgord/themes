<?php
/**
 * Шаблон comocon.net
 *
 */
	function meks_disable_srcset( $sources ) {
    	return false;
	} 
	add_filter( 'wp_calculate_image_srcset', 'meks_disable_srcset' );
	
	function my_nav_menu_submenu_css_class( $classes ) {
    $classes[] = 'nav';
    	return $classes;
	}
	add_filter( 'nav_menu_submenu_css_class', 'my_nav_menu_submenu_css_class' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 1568, 9999 );

		// This theme uses wp_nav_menu() in two locations.
	register_nav_menus(
		array(
			'header' => __( 'Header Menu'),
			'header1' => __( 'Header Menu 1'),
			'header2' => __( 'Header Menu 2'),
			'footer' => __( 'Footer Menu' ),
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height' => 480,
    		'width'  => 720,
			'flex-width'  => false,
			'flex-height' => false,
		)
	);

	add_filter( 'get_custom_logo', 'change_logo_class' );
	function change_logo_class( $html ) {
	    $html = str_replace( 'custom-logo', 'logo', $html );
	    return $html;
	}

function short_title($char) {
         $title = get_the_title($post->ID);
         $title = substr($title,0,$char);
         echo $title.'...';
}

/* Подключаем страницу настроек темы */
get_template_part('theme-options');

wp_suspend_cache_addition( true );

?>