<?php
/**
 * Шаблон comocon.net
 *
 */

get_header();?>

<div class="main-block" style="padding-top: 20px;">
  <?php
      if ( function_exists('yoast_breadcrumb') ) {
      yoast_breadcrumb('
      <p id="breadcrumbs" style="padding-left: 45px;">','</p>
      ');
      }
      ?>
  <?php
$query_args = array('post_status' => 'publish', 'posts_per_page' => '-1');
$query = new WP_Query( $query_args );
$posts_id = array();
$post_id = get_the_ID();
?>
<?php
if ( $query->have_posts() ) {
    while ( $query->have_posts() ) {
        $query->the_post();
        array_push($posts_id, get_the_ID());
    }
}
wp_reset_postdata();

$count_posts = count($posts_id);
$hot = [];
      $cold = [];
      for ($i=0; $i<5; $i++){
         $id = rand(0,$count_posts);
         array_push($hot,$posts_id[$id]);
         $id = rand(0,$count_posts);
         array_push($cold,$posts_id[$id]);
      }

$posts_id_array = [];
$co = 0;
for ($i=0; $i<strlen($post_id); $i++) {
  $co += $post_id[$i];
  echo $post_id[$i];
}
$co = 7;
$temp = $count_posts - $co;
$temp_del = intdiv($temp,6);
//заполняем массив с постами
array_push($posts_id_array, $posts_id[$temp]);
array_push($posts_id_array, $posts_id[$temp_del]);
array_push($posts_id_array, $posts_id[$temp_del*2]);
array_push($posts_id_array, $posts_id[$temp_del*3]);
array_push($posts_id_array, $posts_id[$temp_del*4]);
array_push($posts_id_array, $posts_id[$temp_del*5]);
?>

  <table class="main-table" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td width="780" valign="top">
        <?php
      while( have_posts() ) : the_post();?>
        <h1 style="font-size: 18px !important;font-weight: 700 !important;text-align: center;padding: 20px 0 !important;"><? the_title();?> </h1><div style="display: flex;justify-content: center;padding: 12px;">
        <?php the_post_thumbnail();
        ?>
        </div>
        <div style="padding: 20px;">
        <?
        the_content(); // выводим контент
        ?>
        </div>
        <?
      endwhile;
      ?>
                          <div class="single_post clearfix blk">
      <div style="display:flex;justify-content:space-around;margin: 20px 0;">
        <span style="font-size: 18px;color: #fdc74b;">Вам так же понравятся игровые автоматы</span>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: center;flex-wrap: wrap;">
      <?php
        $query = new WP_Query(['post_type' => 'post','post_status' => 'publish','post__in' => $posts_id_array]);
        if ( $query->have_posts() ) {
          while ( $query->have_posts() ) {
              $query->the_post();?>
              <div style="width:30%;">
                <div>
                      <a href="<?php the_permalink(); ?>" style="display: flex;flex-direction: column; color: #fdc74b; font-size: 12px;"><?php
                      $default_attr = array('alt' => get_permalink());
                      the_post_thumbnail(array(224),$default_attr);?><span style="text-align: center;padding: 8px;"><?php short_title(25); ?></span></a><br>
               </div>
              </div>
          <?}
        }
        wp_reset_postdata();
      ?>
      </div>
        </div>
      </td>


<?php
      $query_args = array('post_status' => 'publish', 'posts_per_page' => '-1');
      $query = new WP_Query( $query_args );
      $posts_id = array();
      $post_id = get_the_ID();
      ?>
      <?php
      if ( $query->have_posts() ) {
          while ( $query->have_posts() ) {
              $query->the_post();
              array_push($posts_id, get_the_ID());
          }
      }
      wp_reset_postdata();

      $count_posts = count($posts_id);
      $popular = [];
      $hot = [];
      $cold = [];
      for ($i=0; $i<10; $i++){
         $id = rand(0,$count_posts);
         array_push($popular,$posts_id[$id]);
      }
      for ($i=0; $i<5; $i++){
         $id = rand(0,$count_posts);
         array_push($hot,$posts_id[$id]);
         $id = rand(0,$count_posts);
         array_push($cold,$posts_id[$id]);
      }
      ?>



      <td class="td-for-blocks" align="center">
        <div class="sidebar" style="margin-top: 20px;">
         <div class="slider" style="height: 100%;">
            <div class="bx-wrapper" style="max-width: 100%; margin: 0px auto;">
               <div class="bx-viewport" style="width: 100%; overflow: hidden; position: relative; border-radius: 3%;">
                     <li style="list-style: none; position: relative;" class="bx-clone">
                        <div class="nav-block blk">
                           <div class="bestgames sblk">
                              <div class="best_wins">
                                 <div class="title">Популярные Игры</div>
                                 <div class="border">

                              <?php
                             $query = new WP_Query(['post_type' => 'post','post_status' => 'publish','post__in' => $popular]);
                             if ( $query->have_posts() ) {
                               while ( $query->have_posts() ) {
                                   $query->the_post();?>
                                   <div style="padding: 0 10px;">
                                       <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                                   <a href="<?php the_permalink(); ?>"><?php
                                                   $default_attr = array('alt' => get_permalink());
                                                   the_post_thumbnail(array(42, 42),$default_attr);?><span><?php short_title(25); ?></span></a><br>
                                       </div>
                                       <div class="slicer"></div>
                                    </div>
                               <?}
                             } 
                                 wp_reset_postdata();
                              ?>

                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
         <ul>
            <li>
               <div class="nav-block blk">
                  <div class="bestgames sblk">
                     <div class="hot-games">
                        <div class="title">Горячие игры</div>
                        <div class="border">
                        <?php
                             $query = new WP_Query(['post_type' => 'post','post_status' => 'publish','post__in' => $hot]);
                             if ( $query->have_posts() ) {
                               while ( $query->have_posts() ) {
                                   $query->the_post();?>
                                   <div style="padding: 0 10px;">
                                    <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                          <a href="<?php the_permalink(); ?>"><?php
                                          $default_attr = array('alt' => get_permalink());
                                          the_post_thumbnail(array(34, 34),$default_attr);?><span><?php short_title(25); ?></span></a><br>
                                       </div>
                                       <div class="slicer"></div>
                                   </div>
                               <?}
                             } 
                                 wp_reset_postdata();
                              ?>
                        </div>
                     </div>
                  </div>
               </div>
            </li>
            <li style="margin-top: 10px;">
               <div class="nav-block blk">
                  <div class="bestgames sblk">
                     <div class="cold-games">
                        <div class="title">Холодные игры</div>
                        <div class="border">
                        <?php
                             $query = new WP_Query(['post_type' => 'post','post_status' => 'publish','post__in' => $cold]);
                             if ( $query->have_posts() ) {
                               while ( $query->have_posts() ) {
                                   $query->the_post();?>
                                   <div style="padding: 0 10px;">
                                    <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                          <a href="<?php the_permalink(); ?>"><?php
                                          $default_attr = array('alt' => get_permalink());
                                          the_post_thumbnail(array(34, 34),$default_attr);?><span><?php short_title(25); ?></span></a><br>
                                       </div>
                                       <div class="slicer"></div>
                                   </div>
                               <?}
                             } 
                                 wp_reset_postdata();
                              ?>  
                        </div>
                     </div>
                  </div>
               </div>
            </li>
         </ul>
      </div>
      </td>
    </tr>
  </tbody>
</table>
</div>

<?php get_footer(); ?>