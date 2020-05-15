<?php
/**
 * Шаблон comocon.net
 *
 */
?>

<div class="footer" style="width: 999.5px;">
   <div class="footer-inner" style="border:1px solid #303030;">
      <div class="age18">18+</div>
      <div class="links-block">
         <div style="float:left;width:200px;margin: 0px 14px;">
            <?php wp_nav_menu(array('theme_location' => 'footer',
                        'container_id'    => ''
            )); ?>
         </div>
      </div>
      <br>
      <div class="footer-copy"><?php $theme_all_options = get_option('theme_options');
      echo $theme_all_options['my_textarea_footer_copyright'];?></div>
      <div style="clear: both;"></div>
   </div>
   <br>
</div>

<?php wp_footer(); ?>

</body>
</html>