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
  <table class="main-table" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td width="780" valign="top">
        <h1 style="text-align: center;padding-left:45px;font-size: 18px !important;font-weight: 700 !important;text-align: center;padding: 20px 0 !important;"><?php single_cat_title();?></h1>
                          <?php
                global $post;
                        $posts_per_page = 48;
                        $count_posts = wp_count_posts();
                        $published_posts = $count_posts->publish;
                        $cat_id =  get_queried_object_id();
                $args = array( 'posts_per_page' => $posts_per_page, 'cat' => $cat_id);
                $myposts = get_posts( $args );
                        if ($published_posts > $posts_per_page) {
                           for ($i=0;$i<(int)($published_posts / $posts_per_page);$i++) {
                              //echo $i;
                              ?>
                              <div class="screen">
                              <div class="items">
                              <?
                              foreach( $myposts as $post ){ setup_postdata($post);
                                ?>
                                <div class="link-3col">
                                  <div style="padding: 10px;" class="item">
                                    <span class="link-3col-title">
                                      <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
                                    </span>
                                    <div class="link-3col-content" style="cursor:pointer;"><div align="center"><?php 
                                            $default_attr = array('alt' => get_permalink());the_post_thumbnail(full, $default_attr);?></div></div>
                                    <div class="info">
                                         <?php if ( get_field('link') ) { ?>
                                        <a href="<?php the_field('link'); ?>" target="game" class="on_money">На деньги</a>
                                         <?php } else { ?>
                                           <a href="" target="game" class="" style="width: 10px;"></a>
                                         <?php }?>
                                           <a href="<?php the_permalink(); ?>" target="game" class="demo">Бесплатно</a>
                                         <div><a class="information" href="<?php the_permalink(); ?>" style="padding: 0 17px;">Информация</a></div>
                                    </div>
									<div class="hover"></div>
                                  </div>
                                </div>
                                <?php
                      }
                              ?>
                              </div>
                            </div>
                              <?
                           }
                        }
                wp_reset_postdata();
              ?>
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
      $hot = [];
      $cold = [];
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
                      global $post;
                      $args = array( 'posts_per_page' => 10);
                      $myposts = get_posts( $args );
                      foreach( $myposts as $post ){ setup_postdata($post);
                        ?>
                        <div>
                          <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                                <a href="<?php the_permalink(); ?>"><?php
                                                   $default_attr = array('alt' => get_permalink());
                                                   the_post_thumbnail(array(42, 42),$default_attr);?><span><?php the_title(); ?></span></a><br>
                                             </div>
                                             <div class="slicer"></div>
                                           </div>
                        <?php
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
<div style="padding-left: 20px;">
        <?php echo category_description();?>
      </div>
</div>

<?php get_footer(); ?>