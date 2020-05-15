<?php /**
 * Шаблон comocon.net
 *
 */
?>

</div><!-- #content -->



<div class="footer">
   <div class="pay-systems">
      <div class="wrap">
         <div><a href="http://igg.cash/" target="_blank"><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/i-g-g-c-a-s-h.png"></a></div>
         <div><a href="http://igroforum.org" target="_blank"><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/igroforum.png"></a></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/diploma.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/shape.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/18.png"></div>
         <div><a href="http://artgambling.com/index.php/ru/kontrol-chestnosti" target="_blank"><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/md-5.png"></a></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/footer_icons/virus.png"></div>
      </div>
      <div class="wrap" style="margin-top: 20px; width: 800px">
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/visa-pay-logo.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/webmoney-paying-logo.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/master-card-logo.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/yandex-pay-logo.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/logo_qiwi_rgb.png"></div>
         <div><img src="<?php echo get_template_directory_uri(); ?>/assets/i/ps/w1.png"></div>
      </div>
   </div>
   <div class="foo-nav blk" style="padding-top: 15px">
      <div class="wrap">
	    <?php wp_nav_menu(array('theme_location' => 'footer',
	    						'container_id'    => '',
	    						'menu_class'      => 'nav'
	  	)); ?>
	   </div>
   </div>
   <?php 
      $theme_all_options = get_option('theme_options');
      echo $theme_all_options['my_textarea_footer_copyright']; 
   ?>
</div>

<?php wp_footer(); ?>

</body>
</html>