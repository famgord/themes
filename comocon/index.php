<?php
/**
 * Шаблон comocon.net
 *
 */

get_header();?>

<div class="container clearfix">
   <div class="wrap">
      <div class="content">
         <div class="slider-middle blk">
            <div class="tile clearfix">
               <div class="bx-wrapper" style="max-width: 100%;">
                  <div class="bx-viewport">
                      <div class="bxslider" style="position: relative; transition-duration: 0s;">
                        <div class="screen">
                          <?php
                        global $post;
                        $posts_per_page = 48;
                        $count_posts = wp_count_posts();
                        $published_posts = $count_posts->publish;
                         if ($published_posts > $posts_per_page) {
                            for ($i=0;$i<(int)(ceil($published_posts / $posts_per_page));$i++) {
                            $args = array( 'posts_per_page' => $posts_per_page, 'offset'=> $i*48);
                            $myposts = get_posts( $args );
                        ?>
                        <div class="items">
                        <?
                      foreach( $myposts as $post ){ setup_postdata($post);
                        ?>
                        <div class="item">
                          <div class="name"><h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1></div>
                          <div class="ico"><a href="<?php the_permalink(); ?>"><?php 
                                    $default_attr = array('alt' => get_permalink());the_post_thumbnail(full, $default_attr);?></a></div>
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
                        <?php
                      }//цикл foreach
                              ?>
                              </div>
                              <?
                           }//цикл for
                        }//if
                        else {
                        ?>
                        <div class="items">
                        <?
                        $args = array( 'posts_per_page' => $posts_per_page);
                        $myposts = get_posts( $args );
                      foreach( $myposts as $post ){ setup_postdata($post);
                        ?>
                        <div class="item">
                          <div class="name"><h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1></div>
                          <div class="ico"><a href="<?php the_permalink(); ?>"><?php 
                                    $default_attr = array('alt' => get_permalink());the_post_thumbnail(full, $default_attr);?></a></div>
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
                        <?php
                      }//цикл foreach
                              ?>
                              </div>
                              <?
                           //}//цикл for
                        }
                wp_reset_postdata();
              ?>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

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
      <div class="sidebar" style="margin-top: 20px;">
         <div class="slider">
            <div class="bx-wrapper" style="max-width: 100%; margin: 0px auto;">
               <div class="bx-viewport" style="width: 100%; overflow: hidden; position: relative; height: 456px;border-radius: 3%;">
                     <li style="float: left; list-style: none; position: relative; width: 248px;" class="bx-clone">
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
                                   <div>
                                       <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                                   <a href="<?php the_permalink(); ?>"><?php
                                                   $default_attr = array('alt' => get_permalink());
                                                   the_post_thumbnail(array(42, 42),$default_attr);?><span><?php the_title(); ?></span></a><br>
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
                                   <div>
                                    <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                          <a href="<?php the_permalink(); ?>"><?php
                                          $default_attr = array('alt' => get_permalink());
                                          the_post_thumbnail(array(34, 34),$default_attr);?><span><?php the_title(); ?></span></a><br>
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
            <li>
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
                                   <div>
                                    <div style="position: relative; z-index: 1; text-align:left; margin-left: 0; overflow: hidden;">
                                          <a href="<?php the_permalink(); ?>"><?php
                                          $default_attr = array('alt' => get_permalink());
                                          the_post_thumbnail(array(34, 34),$default_attr);?><span><?php the_title(); ?></span></a><br>
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
<div class="wrap">
   <div class="foo-content blk mCustomScrollbar _mCS_1">
      <div id="mCSB_1" class="mCustomScrollBox mCS-dark-2 mCSB_vertical mCSB_inside" style="max-height: none;" tabindex="0">
            <?php 
               $theme_all_options = get_option('theme_options');
               if ($theme_all_options != '') {
                  echo '<div id="mCSB_1_container" class="mCSB_container" style="position: relative;left: 0px;" dir="ltr">';
                  echo $theme_all_options['my_textarea_footer'];
                  echo '</div>';
               }
            ?>
      </div>
   </div>
</div>
<?
get_footer(); ?>