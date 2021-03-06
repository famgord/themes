<?php
/**
 * Шаблон comocon.net
 *
 */

get_header(); ?>

<div class="container clearfix">
   <div class="wrap">
      <div class="content">
		<div class="single_post clearfix blk" style="padding-left: 0;">
			<?php
			if ( function_exists('yoast_breadcrumb') ) {
			yoast_breadcrumb('
			<p id="breadcrumbs" style="padding-left: 45px;">','</p>
			');
			}
			?>
			<h1 style="text-align: center;padding-left:45px;"><?php single_cat_title();?></h1>


			<div class="slider-middle blk" style="margin-left: 0;">
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
                        $cat_id =  get_queried_object_id();
								$args = array( 'posts_per_page' => $posts_per_page, 'cat' => $cat_id);
								$myposts = get_posts( $args );
                        if ($published_posts > $posts_per_page) {
                           for ($i=0;$i<(int)($published_posts / $posts_per_page);$i++) {
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
      								}
                              ?>
                              </div>
                              <?
                           }
                        }
								wp_reset_postdata();
							?>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         	<div style="padding-left: 45px;">
				<?php echo category_description();?>
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
      $hot = [];
      $cold = [];
      for ($i=0; $i<5; $i++){
         $id = rand(0,$count_posts);
         array_push($hot,$posts_id[$id]);
         $id = rand(0,$count_posts);
         array_push($cold,$posts_id[$id]);
      }
      ?>
      <div class="sidebar">
         <div class="slider" style="margin-top: 15px;">
            <div class="bx-wrapper" style="max-width: 100%; margin: 0px auto;">
               <div class="bx-viewport" style="width: 100%; overflow: hidden; position: relative; height: 456px; border-radius: 3%;">
                     <li style="float: left; list-style: none; position: relative; width: 248px;" class="bx-clone">
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

<?
get_footer(); ?>