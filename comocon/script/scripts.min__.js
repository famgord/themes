(function ($) {
	var methods = {
		init: function (options) {
			var p = {
				direction: 'left',
				loop: -1,
				scrolldelay: 0,
				scrollamount: 50,
				circular: true,
				drag: true,
				runshort: true,
				hoverstop: true,
				inverthover: false,
				xml: false
			};
			if (options) {
				$.extend(p, options);
			}
			return this.each(function () {
				var enterEvent = 'mouseenter';
				var leaveEvent = 'mouseleave';
				if (p.inverthover) {
					enterEvent = 'mouseleave';
					leaveEvent = 'mouseenter';
				}
				var
					loop = p.loop,
					strWrap = $(this).addClass('str_wrap').data({
						scrollamount: p.scrollamount
					}),
					fMove = false;
				var strWrapStyle = strWrap.attr('style');
				if (strWrapStyle) {
					var wrapStyleArr = strWrapStyle.split(';');
					var startHeight = false;
					for (var i = 0; i < wrapStyleArr.length; i++) {
						var str = $.trim(wrapStyleArr[i]);
						var tested = str.search(/^height/g);
						if (tested != -1) {
							startHeight = parseFloat(strWrap.css('height'));
						}
					}
				}
				var code = function () {
					strWrap.off('mouseleave');
					strWrap.off('mouseenter');
					strWrap.off('mousemove');
					strWrap.off('mousedown');
					strWrap.off('mouseup');
					if (!$('.str_move', strWrap).length) {
						strWrap.wrapInner($('<div>').addClass('str_move'));
					}
					var
						strMove = $('.str_move', strWrap).addClass('str_origin'),
						strMoveClone = strMove.clone().removeClass('str_origin').addClass('str_move_clone'),
						time = 0;
					if (!p.hoverstop) {
						strWrap.addClass('noStop');
					}
					var circCloneHor = function () {
						strMoveClone.clone().css({
							left: '100%',
							right: 'auto',
							width: strMove.width()
						}).appendTo(strMove);
						strMoveClone.css({
							right: '100%',
							left: 'auto',
							width: strMove.width()
						}).appendTo(strMove);
					}
					var circCloneVert = function () {
						strMoveClone.clone().css({
							top: '100%',
							bottom: 'auto',
							height: strMove.height()
						}).appendTo(strMove);
						strMoveClone.css({
							bottom: '100%',
							top: 'auto',
							height: strMove.height()
						}).appendTo(strMove);
					}
					if (p.direction == 'left') {
						strWrap.height(strMove.outerHeight())
						if (strMove.width() > strWrap.width()) {
							var leftPos = -strMove.width();
							if (p.circular) {
								if (!p.xml) {
									circCloneHor();
									leftPos = -(strMove.width() + (strMove.width() - strWrap.width()));
								}
							}
							strMove.css({
								left: strWrap.width()
							})
							var
								strMoveLeft = strWrap.width(),
								k1 = 0,
								timeFunc1 = function () {
									var
										fullS = Math.abs(leftPos),
										time = (fullS / strWrap.data('scrollamount')) * 1000;
									if (parseFloat(strMove.css('left')) != 0) {
										fullS = (fullS + strWrap.width());
										time = (fullS - (strWrap.width() - parseFloat(strMove.css('left')))) / strWrap.data('scrollamount') * 1000;
									}
									return time;
								},
								moveFuncId1 = false,
								moveFunc1 = function () {
									if (loop != 0) {
										strMove.stop(true).animate({
											left: leftPos
										}, timeFunc1(), 'linear', function () {
											$(this).css({
												left: strWrap.width()
											});
											if (loop == -1) {
												moveFuncId1 = setTimeout(moveFunc1, p.scrolldelay);
											} else {
												loop--;
												moveFuncId1 = setTimeout(moveFunc1, p.scrolldelay);
											}
										});
									}
								};
							strWrap.data({
								moveId: moveFuncId1,
								moveF: moveFunc1
							})
							if (!p.inverthover) {
								moveFunc1();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									clearTimeout(moveFuncId1);
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc1();
								});
								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if (p.inverthover) {
											strMove.stop(true);
										}
										var dragLeft;
										var dir = 1;
										var newX;
										var oldX = e.clientX;
										strMoveLeft = strMove.position().left;
										k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
										$(this).on('mousemove', function (e) {
											fMove = true;
											newX = e.clientX;
											if (newX > oldX) {
												dir = 1
											} else {
												dir = -1
											}
											oldX = newX
											dragLeft = k1 + (e.clientX - strWrap.offset().left);
											if (!p.circular) {
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > strWrap.width() && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											} else {
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = 0;
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > 0 && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}
											strMove.stop(true).css({
												left: dragLeft
											});
										}).on('mouseup', function () {
											$(this).off('mousemove');
											if (p.inverthover) {
												strMove.trigger('mouseenter')
											}
											setTimeout(function () {
												fMove = false
											}, 50)
										});
										return false;
									}).on('click', function () {
										if (fMove) {
											return false
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								strMove.css({
									left: strWrap.width()
								});
								var
									strMoveLeft = strWrap.width(),
									k1 = 0,
									timeFunc = function () {
										time = (strMove.width() + strMove.position().left) / strWrap.data('scrollamount') * 1000;
										return time;
									};
								var moveFunc = function () {
									var leftPos = -strMove.width();
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: strWrap.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										}
									});
								};
								strWrap.data({
									moveF: moveFunc
								})
								if (!p.inverthover) {
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});
									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if (p.inverthover) {
												strMove.stop(true);
											}
											var dragLeft;
											var dir = 1;
											var newX;
											var oldX = e.clientX;
											strMoveLeft = strMove.position().left;
											k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
											$(this).on('mousemove', function (e) {
												fMove = true;
												newX = e.clientX;
												if (newX > oldX) {
													dir = 1
												} else {
													dir = -1
												}
												oldX = newX
												dragLeft = k1 + (e.clientX - strWrap.offset().left);
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > strWrap.width() && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												strMove.stop(true).css({
													left: dragLeft
												});
											}).on('mouseup', function () {
												if (p.inverthover) {
													strMove.trigger('mouseenter')
												}
												$(this).off('mousemove');
												setTimeout(function () {
													fMove = false
												}, 50)
											});
											return false;
										}).on('click', function () {
											if (fMove) {
												return false
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'right') {
						strWrap.height(strMove.outerHeight())
						strWrap.addClass('str_right');
						strMove.css({
							left: -strMove.width(),
							right: 'auto'
						})
						if (strMove.width() > strWrap.width()) {
							var leftPos = strWrap.width();
							strMove.css({
								left: 0
							})
							if (p.circular) {
								if (!p.xml) {
									circCloneHor();
									leftPos = strMove.width();
								}
							}
							var
								k2 = 0;
							timeFunc = function () {
								var
									fullS = strWrap.width(),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('left')) != 0) {
									fullS = (strMove.width() + strWrap.width());
									time = (fullS - (strMove.width() + parseFloat(strMove.css('left')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: -strMove.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							strWrap.data({
								moveF: moveFunc
							})
							if (!p.inverthover) {
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});
								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if (p.inverthover) {
											strMove.stop(true);
										}
										var dragLeft;
										var dir = 1;
										var newX;
										var oldX = e.clientX;
										strMoveLeft = strMove.position().left;
										k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
										$(this).on('mousemove', function (e) {
											fMove = true;
											newX = e.clientX;
											if (newX > oldX) {
												dir = 1
											} else {
												dir = -1
											}
											oldX = newX
											dragLeft = k2 + (e.clientX - strWrap.offset().left);
											if (!p.circular) {
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > strWrap.width() && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											} else {
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = 0;
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > 0 && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}
											strMove.stop(true).css({
												left: dragLeft
											});
										}).on('mouseup', function () {
											if (p.inverthover) {
												strMove.trigger('mouseenter')
											}
											$(this).off('mousemove');
											setTimeout(function () {
												fMove = false
											}, 50)
										});
										return false;
									}).on('click', function () {
										if (fMove) {
											return false
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								var k2 = 0;
								var timeFunc = function () {
									time = (strWrap.width() - strMove.position().left) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var leftPos = strWrap.width();
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: -strMove.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
								strWrap.data({
									moveF: moveFunc
								})
								if (!p.inverthover) {
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});
									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if (p.inverthover) {
												strMove.stop(true);
											}
											var dragLeft;
											var dir = 1;
											var newX;
											var oldX = e.clientX;
											strMoveLeft = strMove.position().left;
											k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
											$(this).on('mousemove', function (e) {
												fMove = true;
												newX = e.clientX;
												if (newX > oldX) {
													dir = 1
												} else {
													dir = -1
												}
												oldX = newX
												dragLeft = k2 + (e.clientX - strWrap.offset().left);
												if (dragLeft < -strMove.width() && dir < 0) {
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if (dragLeft > strWrap.width() && dir > 0) {
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												strMove.stop(true).css({
													left: dragLeft
												});
											}).on('mouseup', function () {
												if (p.inverthover) {
													strMove.trigger('mouseenter')
												}
												$(this).off('mousemove');
												setTimeout(function () {
													fMove = false
												}, 50)
											});
											return false;
										}).on('click', function () {
											if (fMove) {
												return false
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'up') {
						strWrap.addClass('str_vertical');
						if (strMove.height() > strWrap.height()) {
							var topPos = -strMove.height();
							if (p.circular) {
								if (!p.xml) {
									circCloneVert();
									topPos = -(strMove.height() + (strMove.height() - strWrap.height()));
								}
							}
							if (p.xml) {
								strMove.css({
									top: strWrap.height()
								})
							}
							var
								k2 = 0;
							timeFunc = function () {
								var
									fullS = Math.abs(topPos),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('top')) != 0) {
									fullS = (fullS + strWrap.height());
									time = (fullS - (strWrap.height() - parseFloat(strMove.css('top')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: strWrap.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							strWrap.data({
								moveF: moveFunc
							})
							if (!p.inverthover) {
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});
								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if (p.inverthover) {
											strMove.stop(true);
										}
										var dragTop;
										var dir = 1;
										var newY;
										var oldY = e.clientY;
										strMoveTop = strMove.position().top;
										k2 = strMoveTop - (e.clientY - strWrap.offset().top);
										$(this).on('mousemove', function (e) {
											fMove = true;
											newY = e.clientY;
											if (newY > oldY) {
												dir = 1
											} else {
												if (newY < oldY) {
													dir = -1
												}
											}
											oldY = newY
											dragTop = k2 + e.clientY - strWrap.offset().top;
											if (!p.circular) {
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > strWrap.height() && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											} else {
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = 0;
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > 0 && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											}
											strMove.stop(true).css({
												top: dragTop
											});
										}).on('mouseup', function () {
											if (p.inverthover) {
												strMove.trigger('mouseenter')
											}
											$(this).off('mousemove');
											setTimeout(function () {
												fMove = false
											}, 50)
										});
										return false;
									}).on('click', function () {
										if (fMove) {
											return false
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								strMove.css({
									top: strWrap.height()
								});
								var k2 = 0;
								var timeFunc = function () {
									time = (strMove.height() + strMove.position().top) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var topPos = -strMove.height();
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: strWrap.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
								strWrap.data({
									moveF: moveFunc
								})
								if (!p.inverthover) {
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});
									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if (p.inverthover) {
												strMove.stop(true);
											}
											var dragTop;
											var dir = 1;
											var newY;
											var oldY = e.clientY;
											strMoveTop = strMove.position().top;
											k2 = strMoveTop - (e.clientY - strWrap.offset().top);
											$(this).on('mousemove', function (e) {
												fMove = true;
												newY = e.clientY;
												if (newY > oldY) {
													dir = 1
												} else {
													if (newY < oldY) {
														dir = -1
													}
												}
												oldY = newY
												dragTop = k2 + e.clientY - strWrap.offset().top;
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > strWrap.height() && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												strMove.stop(true).css({
													top: dragTop
												});
											}).on('mouseup', function () {
												if (p.inverthover) {
													strMove.trigger('mouseenter')
												}
												$(this).off('mousemove');
												setTimeout(function () {
													fMove = false
												}, 50)
											});
											return false;
										}).on('click', function () {
											if (fMove) {
												return false
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'down') {
						strWrap.addClass('str_vertical').addClass('str_down');
						strMove.css({
							top: -strMove.height(),
							bottom: 'auto'
						})
						if (strMove.height() > strWrap.height()) {
							var topPos = strWrap.height();
							if (p.circular) {
								if (!p.xml) {
									circCloneVert();
									topPos = strMove.height();
								}
							}
							if (p.xml) {
								strMove.css({
									top: -strMove.height()
								})
							}
							var
								k2 = 0;
							timeFunc = function () {
								var
									fullS = strWrap.height(),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('top')) != 0) {
									fullS = (strMove.height() + strWrap.height());
									time = (fullS - (strMove.height() + parseFloat(strMove.css('top')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: -strMove.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							strWrap.data({
								moveF: moveFunc
							})
							if (!p.inverthover) {
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});
								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if (p.inverthover) {
											strMove.stop(true);
										}
										var dragTop;
										var dir = 1;
										var newY;
										var oldY = e.clientY;
										strMoveTop = strMove.position().top;
										k2 = strMoveTop - (e.clientY - strWrap.offset().top);
										$(this).on('mousemove', function (e) {
											fMove = true;
											newY = e.clientY;
											if (newY > oldY) {
												dir = 1
											} else {
												if (newY < oldY) {
													dir = -1
												}
											}
											oldY = newY
											dragTop = k2 + e.clientY - strWrap.offset().top;
											if (!p.circular) {
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > strWrap.height() && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											} else {
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = 0;
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > 0 && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											}
											strMove.stop(true).css({
												top: dragTop
											});
										}).on('mouseup', function () {
											if (p.inverthover) {
												strMove.trigger('mouseenter')
											}
											$(this).off('mousemove');
											setTimeout(function () {
												fMove = false
											}, 50)
										});
										return false;
									}).on('click', function () {
										if (fMove) {
											return false
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								var k2 = 0;
								var timeFunc = function () {
									time = (strWrap.height() - strMove.position().top) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var topPos = strWrap.height();
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: -strMove.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
								strWrap.data({
									moveF: moveFunc
								})
								if (!p.inverthover) {
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});
									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if (p.inverthover) {
												strMove.stop(true);
											}
											var dragTop;
											var dir = 1;
											var newY;
											var oldY = e.clientY;
											strMoveTop = strMove.position().top;
											k2 = strMoveTop - (e.clientY - strWrap.offset().top);
											$(this).on('mousemove', function (e) {
												fMove = true;
												newY = e.clientY;
												if (newY > oldY) {
													dir = 1
												} else {
													if (newY < oldY) {
														dir = -1
													}
												}
												oldY = newY
												dragTop = k2 + e.clientY - strWrap.offset().top;
												if (dragTop < -strMove.height() && dir < 0) {
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if (dragTop > strWrap.height() && dir > 0) {
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												strMove.stop(true).css({
													top: dragTop
												});
											}).on('mouseup', function () {
												if (p.inverthover) {
													strMove.trigger('mouseenter')
												}
												$(this).off('mousemove');
												setTimeout(function () {
													fMove = false
												}, 50)
											})
											return false;
										}).on('click', function () {
											if (fMove) {
												return false
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
				}
				if (p.xml) {
					$.ajax({
						url: p.xml,
						dataType: "xml",
						success: function (xml) {
							var xmlTextEl = $(xml).find('text');
							var xmlTextLength = xmlTextEl.length;
							for (var i = 0; i < xmlTextLength; i++) {
								var xmlElActive = xmlTextEl.eq(i);
								var xmlElContent = xmlElActive.text();
								var xmlItemEl = $('<span>').text(xmlElContent).appendTo(strWrap);
								if (p.direction == 'left' || p.direction == 'right') {
									xmlItemEl.css({
										display: 'inline-block',
										textAlign: 'right'
									});
									if (i > 0) {
										xmlItemEl.css({
											width: strWrap.width() + xmlItemEl.width()
										});
									}
								}
								if (p.direction == 'down' || p.direction == 'up') {
									xmlItemEl.css({
										display: 'block',
										textAlign: 'left'
									});
									if (i > 0) {
										xmlItemEl.css({
											paddingTop: strWrap.height()
										});
									}
								}
							}
							code();
						}
					});
				} else {
					code();
				}
				strWrap.data({
					ini: code,
					startheight: startHeight
				})
			});
		},
		update: function () {
			var el = $(this);
			var str_origin = $('.str_origin', el);
			var str_move_clone = $('.str_move_clone', el);
			str_origin.stop(true);
			str_move_clone.remove();
			el.data('ini')();
		},
		destroy: function () {
			var el = $(this);
			var elMove = $('.str_move', el);
			var startHeight = el.data('startheight');
			$('.str_move_clone', el).remove();
			el.off('mouseenter');
			el.off('mousedown');
			el.off('mouseup');
			el.off('mouseleave');
			el.off('mousemove');
			el.removeClass('noStop').removeClass('str_vertical').removeClass('str_active').removeClass('no_drag').removeClass('str_static').removeClass('str_right').removeClass('str_down');
			var elStyle = el.attr('style');
			if (elStyle) {
				var styleArr = elStyle.split(';');
				for (var i = 0; i < styleArr.length; i++) {
					var str = $.trim(styleArr[i]);
					var tested = str.search(/^height/g);
					if (tested != -1) {
						styleArr[i] = '';
					}
				}
				var newArr = styleArr.join(';');
				var newStyle = newArr.replace(/;+/g, ';')
				if (newStyle == ';') {
					el.removeAttr('style');
				} else {
					el.attr('style', newStyle);
				}
				if (startHeight) {
					el.css({
						height: startHeight
					})
				}
			}
			elMove.stop(true);
			if (elMove.length) {
				var context = elMove.html();
				elMove.remove();
				el.html(context);
			}
		},
		pause: function () {
			var el = $(this);
			var elMove = $('.str_move', el);
			elMove.stop(true);
		},
		play: function () {
			var el = $(this);
			$(this).off('mousemove');
			el.data('moveF')();
		}
	};
	$.fn.liMarquee = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метод ' + method + ' в jQuery.liMarquee не существует');
		}
	};
})(jQuery);
$('a.flipper').click(function () {
	$('.flip').toggleClass('flipped');
});
(function ($) {
	$('a[data-reveal-id]').live('click', function (e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		var modal = $('#' + modalLocation);
		var options = $.extend({}, $(this).data(), options);
		modal.on('reveal:onOpen', function () {
			modal.find('.ripple').removeClass('notransition');
		}).on('reveal:onClose', function () {
			modal.find('.ripple').addClass('notransition');
		});
		modal.reveal(options);
		modal.height(modal.children('div').height() + 37);
		modal.find('input[type=checkbox], .dismiss-modal').each(function () {
			if ($(this).prop('required') || $(this).hasClass('dismiss-modal')) {
				$(this).prop('checked', true);
				$(this).on('click', function () {
					modal.trigger('reveal:close');
				});
			}
		});
		modal.find('form[novalidate!="novalidate"]').submit(function () {
			modal.trigger('reveal:close');
		});
		modal.find('.forgot a, a[onclick]').on('click', function () {
			modal.trigger('reveal:close');
		});
	});
	$.fn.reveal = function (options) {
		var defaults = {
			animation: 'fadeAndPop',
			animationspeed: 300,
			closeonbackgroundclick: true,
			dismissmodalclass: 'close-reveal-modal'
		};
		var options = $.extend({}, defaults, options);
		return this.each(function () {
			var modal = $(this),
				topMeasure = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
				locked = false,
				modalBG = $('.reveal-modal-bg');
			if (modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}
			modal.bind('reveal:open', function () {
				modalBG.unbind('click.modalEvent');
				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if (!locked) {
					lockModal();
					if (options.animation == "fadeAndPop") {
						modal.css({
							'top': $(document).scrollTop() - topOffset,
							'opacity': 0,
							'visibility': 'visible'
						});
						modalBG.fadeIn(options.animationspeed / 2);
						modal.delay(options.animationspeed / 2).animate({
							"top": $(document).scrollTop() + topMeasure + 'px',
							"opacity": 1
						}, options.animationspeed, unlockModal());
					}
					if (options.animation == "fade") {
						modal.css({
							'opacity': 0,
							'visibility': 'visible',
							'top': $(document).scrollTop() + topMeasure
						});
						modalBG.fadeIn(options.animationspeed / 2);
						modal.delay(options.animationspeed / 2).animate({
							"opacity": 1
						}, options.animationspeed, unlockModal());
					}
					if (options.animation == "none") {
						modal.css({
							'visibility': 'visible',
							'top': $(document).scrollTop() + topMeasure
						});
						modalBG.css({
							"display": "block"
						});
						unlockModal()
					}
				}
				modal.unbind('reveal:open');
				modal.trigger('reveal:onOpen');
			});
			modal.bind('reveal:close', function () {
				if (!locked) {
					lockModal();
					if (options.animation == "fadeAndPop") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top": $(document).scrollTop() - topOffset + 'px',
							"opacity": 0
						}, options.animationspeed / 2, function () {
							modal.css({
								'top': topMeasure,
								'opacity': 1,
								'visibility': 'hidden'
							});
							unlockModal();
						});
					}
					if (options.animation == "fade") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"opacity": 0
						}, options.animationspeed, function () {
							modal.css({
								'opacity': 1,
								'visibility': 'hidden',
								'top': topMeasure
							});
							unlockModal();
						});
					}
					if (options.animation == "none") {
						modal.css({
							'visibility': 'hidden',
							'top': topMeasure
						});
						modalBG.css({
							'display': 'none'
						});
					}
				}
				modal.unbind('reveal:close');
				modal.trigger('reveal:onClose');
			});
			modal.trigger('reveal:open')
			var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
				modal.trigger('reveal:close')
			});
			if (options.closeonbackgroundclick) {
				modalBG.css({
					"cursor": "pointer"
				})
				modalBG.bind('click.modalEvent', function () {
					modal.trigger('reveal:close')
				});
			}
			$('body').keyup(function (e) {
				if (e.which === 27) {
					modal.trigger('reveal:close');
				}
			});

			function unlockModal() {
				locked = false;
			}

			function lockModal() {
				locked = true;
			}
		});
	}
})(jQuery);
/* Tooltipster v3.3.0 */
(function (e, t, n) {
	function s(t, n) {
		this.bodyOverflowX;
		this.callbacks = {
			hide: [],
			show: []
		};
		this.checkInterval = null;
		this.Content;
		this.$el = e(t);
		this.$elProxy;
		this.elProxyPosition;
		this.enabled = true;
		this.options = e.extend({}, i, n);
		this.mouseIsOverProxy = false;
		this.namespace = "tooltipster-" + Math.round(Math.random() * 1e5);
		this.Status = "hidden";
		this.timerHide = null;
		this.timerShow = null;
		this.$tooltip;
		this.options.iconTheme = this.options.iconTheme.replace(".", "");
		this.options.theme = this.options.theme.replace(".", "");
		this._init()
	}

	function o(t, n) {
		var r = true;
		e.each(t, function (e, i) {
			if (typeof n[e] === "undefined" || t[e] !== n[e]) {
				r = false;
				return false
			}
		});
		return r
	}

	function f() {
		return !a && u
	}

	function l() {
		var e = n.body || n.documentElement,
			t = e.style,
			r = "transition";
		if (typeof t[r] == "string") {
			return true
		}
		v = ["Moz", "Webkit", "Khtml", "O", "ms"], r = r.charAt(0).toUpperCase() + r.substr(1);
		for (var i = 0; i < v.length; i++) {
			if (typeof t[v[i] + r] == "string") {
				return true
			}
		}
		return false
	}
	var r = "tooltipster",
		i = {
			animation: "fade",
			arrow: true,
			arrowColor: "",
			autoClose: true,
			content: null,
			contentAsHTML: false,
			contentCloning: true,
			debug: true,
			delay: 200,
			minWidth: 0,
			maxWidth: null,
			functionInit: function (e, t) {},
			functionBefore: function (e, t) {
				t()
			},
			functionReady: function (e, t) {},
			functionAfter: function (e) {},
			hideOnClick: false,
			icon: "(?)",
			iconCloning: true,
			iconDesktop: false,
			iconTouch: false,
			iconTheme: "tooltipster-icon",
			interactive: false,
			interactiveTolerance: 350,
			multiple: false,
			offsetX: 0,
			offsetY: 0,
			onlyOne: false,
			position: "top",
			positionTracker: false,
			positionTrackerCallback: function (e) {
				if (this.option("trigger") == "hover" && this.option("autoClose")) {
					this.hide()
				}
			},
			restoration: "current",
			speed: 350,
			timer: 0,
			theme: "tooltipster-default",
			touchDevices: true,
			trigger: "hover",
			updateAnimation: true
		};
	s.prototype = {
		_init: function () {
			var t = this;
			if (n.querySelector) {
				var r = null;
				if (t.$el.data("tooltipster-initialTitle") === undefined) {
					r = t.$el.attr("title");
					if (r === undefined) r = null;
					t.$el.data("tooltipster-initialTitle", r)
				}
				if (t.options.content !== null) {
					t._content_set(t.options.content)
				} else {
					t._content_set(r)
				}
				var i = t.options.functionInit.call(t.$el, t.$el, t.Content);
				if (typeof i !== "undefined") t._content_set(i);
				t.$el.removeAttr("title").addClass("tooltipstered");
				if (!u && t.options.iconDesktop || u && t.options.iconTouch) {
					if (typeof t.options.icon === "string") {
						t.$elProxy = e('<span class="' + t.options.iconTheme + '"></span>');
						t.$elProxy.text(t.options.icon)
					} else {
						if (t.options.iconCloning) t.$elProxy = t.options.icon.clone(true);
						else t.$elProxy = t.options.icon
					}
					t.$elProxy.insertAfter(t.$el)
				} else {
					t.$elProxy = t.$el
				}
				if (t.options.trigger == "hover") {
					t.$elProxy.on("mouseenter." + t.namespace, function () {
						if (!f() || t.options.touchDevices) {
							t.mouseIsOverProxy = true;
							t._show()
						}
					}).on("mouseleave." + t.namespace, function () {
						if (!f() || t.options.touchDevices) {
							t.mouseIsOverProxy = false
						}
					});
					if (u && t.options.touchDevices) {
						t.$elProxy.on("touchstart." + t.namespace, function () {
							t._showNow()
						})
					}
				} else if (t.options.trigger == "click") {
					t.$elProxy.on("click." + t.namespace, function () {
						if (!f() || t.options.touchDevices) {
							t._show()
						}
					})
				}
			}
		},
		_show: function () {
			var e = this;
			if (e.Status != "shown" && e.Status != "appearing") {
				if (e.options.delay) {
					e.timerShow = setTimeout(function () {
						if (e.options.trigger == "click" || e.options.trigger == "hover" && e.mouseIsOverProxy) {
							e._showNow()
						}
					}, e.options.delay)
				} else e._showNow()
			}
		},
		_showNow: function (n) {
			var r = this;
			r.options.functionBefore.call(r.$el, r.$el, function () {
				if (r.enabled && r.Content !== null) {
					if (n) r.callbacks.show.push(n);
					r.callbacks.hide = [];
					clearTimeout(r.timerShow);
					r.timerShow = null;
					clearTimeout(r.timerHide);
					r.timerHide = null;
					if (r.options.onlyOne) {
						e(".tooltipstered").not(r.$el).each(function (t, n) {
							var r = e(n),
								i = r.data("tooltipster-ns");
							e.each(i, function (e, t) {
								var n = r.data(t),
									i = n.status(),
									s = n.option("autoClose");
								if (i !== "hidden" && i !== "disappearing" && s) {
									n.hide()
								}
							})
						})
					}
					var i = function () {
						r.Status = "shown";
						e.each(r.callbacks.show, function (e, t) {
							t.call(r.$el)
						});
						r.callbacks.show = []
					};
					if (r.Status !== "hidden") {
						var s = 0;
						if (r.Status === "disappearing") {
							r.Status = "appearing";
							if (l()) {
								r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-" + r.options.animation + "-show");
								if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
								r.$tooltip.queue(i)
							} else {
								r.$tooltip.stop().fadeIn(i)
							}
						} else if (r.Status === "shown") {
							i()
						}
					} else {
						r.Status = "appearing";
						var s = r.options.speed;
						r.bodyOverflowX = e("body").css("overflow-x");
						e("body").css("overflow-x", "hidden");
						var o = "tooltipster-" + r.options.animation,
							a = "-webkit-transition-duration: " + r.options.speed + "ms; -webkit-animation-duration: " + r.options.speed + "ms; -moz-transition-duration: " + r.options.speed + "ms; -moz-animation-duration: " + r.options.speed + "ms; -o-transition-duration: " + r.options.speed + "ms; -o-animation-duration: " + r.options.speed + "ms; -ms-transition-duration: " + r.options.speed + "ms; -ms-animation-duration: " + r.options.speed + "ms; transition-duration: " + r.options.speed + "ms; animation-duration: " + r.options.speed + "ms;",
							f = r.options.minWidth ? "min-width:" + Math.round(r.options.minWidth) + "px;" : "",
							c = r.options.maxWidth ? "max-width:" + Math.round(r.options.maxWidth) + "px;" : "",
							h = r.options.interactive ? "pointer-events: auto;" : "";
						r.$tooltip = e('<div class="tooltipster-base ' + r.options.theme + '" style="' + f + " " + c + " " + h + " " + a + '"><div class="tooltipster-content"></div></div>');
						if (l()) r.$tooltip.addClass(o);
						r._content_insert();
						r.$tooltip.appendTo("body");
						r.reposition();
						r.options.functionReady.call(r.$el, r.$el, r.$tooltip);
						if (l()) {
							r.$tooltip.addClass(o + "-show");
							if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
							r.$tooltip.queue(i)
						} else {
							r.$tooltip.css("display", "none").fadeIn(r.options.speed, i)
						}
						r._interval_set();
						e(t).on("scroll." + r.namespace + " resize." + r.namespace, function () {
							r.reposition()
						});
						if (r.options.autoClose) {
							e("body").off("." + r.namespace);
							if (r.options.trigger == "hover") {
								if (u) {
									setTimeout(function () {
										e("body").on("touchstart." + r.namespace, function () {
											r.hide()
										})
									}, 0)
								}
								if (r.options.interactive) {
									if (u) {
										r.$tooltip.on("touchstart." + r.namespace, function (e) {
											e.stopPropagation()
										})
									}
									var p = null;
									r.$elProxy.add(r.$tooltip).on("mouseleave." + r.namespace + "-autoClose", function () {
										clearTimeout(p);
										p = setTimeout(function () {
											r.hide()
										}, r.options.interactiveTolerance)
									}).on("mouseenter." + r.namespace + "-autoClose", function () {
										clearTimeout(p)
									})
								} else {
									r.$elProxy.on("mouseleave." + r.namespace + "-autoClose", function () {
										r.hide()
									})
								}
								if (r.options.hideOnClick) {
									r.$elProxy.on("click." + r.namespace + "-autoClose", function () {
										r.hide()
									})
								}
							} else if (r.options.trigger == "click") {
								setTimeout(function () {
									e("body").on("click." + r.namespace + " touchstart." + r.namespace, function () {
										r.hide()
									})
								}, 0);
								if (r.options.interactive) {
									r.$tooltip.on("click." + r.namespace + " touchstart." + r.namespace, function (e) {
										e.stopPropagation()
									})
								}
							}
						}
					}
					if (r.options.timer > 0) {
						r.timerHide = setTimeout(function () {
							r.timerHide = null;
							r.hide()
						}, r.options.timer + s)
					}
				}
			})
		},
		_interval_set: function () {
			var t = this;
			t.checkInterval = setInterval(function () {
				if (e("body").find(t.$el).length === 0 || e("body").find(t.$elProxy).length === 0 || t.Status == "hidden" || e("body").find(t.$tooltip).length === 0) {
					if (t.Status == "shown" || t.Status == "appearing") t.hide();
					t._interval_cancel()
				} else {
					if (t.options.positionTracker) {
						var n = t._repositionInfo(t.$elProxy),
							r = false;
						if (o(n.dimension, t.elProxyPosition.dimension)) {
							if (t.$elProxy.css("position") === "fixed") {
								if (o(n.position, t.elProxyPosition.position)) r = true
							} else {
								if (o(n.offset, t.elProxyPosition.offset)) r = true
							}
						}
						if (!r) {
							t.reposition();
							t.options.positionTrackerCallback.call(t, t.$el)
						}
					}
				}
			}, 200)
		},
		_interval_cancel: function () {
			clearInterval(this.checkInterval);
			this.checkInterval = null
		},
		_content_set: function (e) {
			if (typeof e === "object" && e !== null && this.options.contentCloning) {
				e = e.clone(true)
			}
			this.Content = e
		},
		_content_insert: function () {
			var e = this,
				t = this.$tooltip.find(".tooltipster-content");
			if (typeof e.Content === "string" && !e.options.contentAsHTML) {
				t.text(e.Content)
			} else {
				t.empty().append(e.Content)
			}
		},
		_update: function (e) {
			var t = this;
			t._content_set(e);
			if (t.Content !== null) {
				if (t.Status !== "hidden") {
					t._content_insert();
					t.reposition();
					if (t.options.updateAnimation) {
						if (l()) {
							t.$tooltip.css({
								width: "",
								"-webkit-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
								"-moz-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
								"-o-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
								"-ms-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
								transition: "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms"
							}).addClass("tooltipster-content-changing");
							setTimeout(function () {
								if (t.Status != "hidden") {
									t.$tooltip.removeClass("tooltipster-content-changing");
									setTimeout(function () {
										if (t.Status !== "hidden") {
											t.$tooltip.css({
												"-webkit-transition": t.options.speed + "ms",
												"-moz-transition": t.options.speed + "ms",
												"-o-transition": t.options.speed + "ms",
												"-ms-transition": t.options.speed + "ms",
												transition: t.options.speed + "ms"
											})
										}
									}, t.options.speed)
								}
							}, t.options.speed)
						} else {
							t.$tooltip.fadeTo(t.options.speed, .5, function () {
								if (t.Status != "hidden") {
									t.$tooltip.fadeTo(t.options.speed, 1)
								}
							})
						}
					}
				}
			} else {
				t.hide()
			}
		},
		_repositionInfo: function (e) {
			return {
				dimension: {
					height: e.outerHeight(false),
					width: e.outerWidth(false)
				},
				offset: e.offset(),
				position: {
					left: parseInt(e.css("left")),
					top: parseInt(e.css("top"))
				}
			}
		},
		hide: function (n) {
			var r = this;
			if (n) r.callbacks.hide.push(n);
			r.callbacks.show = [];
			clearTimeout(r.timerShow);
			r.timerShow = null;
			clearTimeout(r.timerHide);
			r.timerHide = null;
			var i = function () {
				e.each(r.callbacks.hide, function (e, t) {
					t.call(r.$el)
				});
				r.callbacks.hide = []
			};
			if (r.Status == "shown" || r.Status == "appearing") {
				r.Status = "disappearing";
				var s = function () {
					r.Status = "hidden";
					if (typeof r.Content == "object" && r.Content !== null) {
						r.Content.detach()
					}
					r.$tooltip.remove();
					r.$tooltip = null;
					e(t).off("." + r.namespace);
					e("body").off("." + r.namespace).css("overflow-x", r.bodyOverflowX);
					e("body").off("." + r.namespace);
					r.$elProxy.off("." + r.namespace + "-autoClose");
					r.options.functionAfter.call(r.$el, r.$el);
					i()
				};
				if (l()) {
					r.$tooltip.clearQueue().removeClass("tooltipster-" + r.options.animation + "-show").addClass("tooltipster-dying");
					if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
					r.$tooltip.queue(s)
				} else {
					r.$tooltip.stop().fadeOut(r.options.speed, s)
				}
			} else if (r.Status == "hidden") {
				i()
			}
			return r
		},
		show: function (e) {
			this._showNow(e);
			return this
		},
		update: function (e) {
			return this.content(e)
		},
		content: function (e) {
			if (typeof e === "undefined") {
				return this.Content
			} else {
				this._update(e);
				return this
			}
		},
		reposition: function () {
			var n = this;
			if (e("body").find(n.$tooltip).length !== 0) {
				n.$tooltip.css("width", "");
				n.elProxyPosition = n._repositionInfo(n.$elProxy);
				var r = null,
					i = e(t).width(),
					s = n.elProxyPosition,
					o = n.$tooltip.outerWidth(false),
					u = n.$tooltip.innerWidth() + 1,
					a = n.$tooltip.outerHeight(false);
				if (n.$elProxy.is("area")) {
					var f = n.$elProxy.attr("shape"),
						l = n.$elProxy.parent().attr("name"),
						c = e('img[usemap="#' + l + '"]'),
						h = c.offset().left,
						p = c.offset().top,
						d = n.$elProxy.attr("coords") !== undefined ? n.$elProxy.attr("coords").split(",") : undefined;
					if (f == "circle") {
						var v = parseInt(d[0]),
							m = parseInt(d[1]),
							g = parseInt(d[2]);
						s.dimension.height = g * 2;
						s.dimension.width = g * 2;
						s.offset.top = p + m - g;
						s.offset.left = h + v - g
					} else if (f == "rect") {
						var v = parseInt(d[0]),
							m = parseInt(d[1]),
							y = parseInt(d[2]),
							b = parseInt(d[3]);
						s.dimension.height = b - m;
						s.dimension.width = y - v;
						s.offset.top = p + m;
						s.offset.left = h + v
					} else if (f == "poly") {
						var w = [],
							E = [],
							S = 0,
							x = 0,
							T = 0,
							N = 0,
							C = "even";
						for (var k = 0; k < d.length; k++) {
							var L = parseInt(d[k]);
							if (C == "even") {
								if (L > T) {
									T = L;
									if (k === 0) {
										S = T
									}
								}
								if (L < S) {
									S = L
								}
								C = "odd"
							} else {
								if (L > N) {
									N = L;
									if (k == 1) {
										x = N
									}
								}
								if (L < x) {
									x = L
								}
								C = "even"
							}
						}
						s.dimension.height = N - x;
						s.dimension.width = T - S;
						s.offset.top = p + x;
						s.offset.left = h + S
					} else {
						s.dimension.height = c.outerHeight(false);
						s.dimension.width = c.outerWidth(false);
						s.offset.top = p;
						s.offset.left = h
					}
				}
				var A = 0,
					O = 0,
					M = 0,
					_ = parseInt(n.options.offsetY),
					D = parseInt(n.options.offsetX),
					P = n.options.position;

				function H() {
					var n = e(t).scrollLeft();
					if (A - n < 0) {
						r = A - n;
						A = n
					}
					if (A + o - n > i) {
						r = A - (i + n - o);
						A = i + n - o
					}
				}

				function B(n, r) {
					if (s.offset.top - e(t).scrollTop() - a - _ - 12 < 0 && r.indexOf("top") > -1) {
						P = n
					}
					if (s.offset.top + s.dimension.height + a + 12 + _ > e(t).scrollTop() + e(t).height() && r.indexOf("bottom") > -1) {
						P = n;
						M = s.offset.top - a - _ - 12
					}
				}
				if (P == "top") {
					var j = s.offset.left + o - (s.offset.left + s.dimension.width);
					A = s.offset.left + D - j / 2;
					M = s.offset.top - a - _ - 12;
					H();
					B("bottom", "top")
				}
				if (P == "top-left") {
					A = s.offset.left + D;
					M = s.offset.top - a - _ - 12;
					H();
					B("bottom-left", "top-left")
				}
				if (P == "top-right") {
					A = s.offset.left + s.dimension.width + D - o;
					M = s.offset.top - a - _ - 12;
					H();
					B("bottom-right", "top-right")
				}
				if (P == "bottom") {
					var j = s.offset.left + o - (s.offset.left + s.dimension.width);
					A = s.offset.left - j / 2 + D;
					M = s.offset.top + s.dimension.height + _ + 12;
					H();
					B("top", "bottom")
				}
				if (P == "bottom-left") {
					A = s.offset.left + D;
					M = s.offset.top + s.dimension.height + _ + 12;
					H();
					B("top-left", "bottom-left")
				}
				if (P == "bottom-right") {
					A = s.offset.left + s.dimension.width + D - o;
					M = s.offset.top + s.dimension.height + _ + 12;
					H();
					B("top-right", "bottom-right")
				}
				if (P == "left") {
					A = s.offset.left - D - o - 12;
					O = s.offset.left + D + s.dimension.width + 12;
					var F = s.offset.top + a - (s.offset.top + s.dimension.height);
					M = s.offset.top - F / 2 - _;
					if (A < 0 && O + o > i) {
						var I = parseFloat(n.$tooltip.css("border-width")) * 2,
							q = o + A - I;
						n.$tooltip.css("width", q + "px");
						a = n.$tooltip.outerHeight(false);
						A = s.offset.left - D - q - 12 - I;
						F = s.offset.top + a - (s.offset.top + s.dimension.height);
						M = s.offset.top - F / 2 - _
					} else if (A < 0) {
						A = s.offset.left + D + s.dimension.width + 12;
						r = "left"
					}
				}
				if (P == "right") {
					A = s.offset.left + D + s.dimension.width + 12;
					O = s.offset.left - D - o - 12;
					var F = s.offset.top + a - (s.offset.top + s.dimension.height);
					M = s.offset.top - F / 2 - _;
					if (A + o > i && O < 0) {
						var I = parseFloat(n.$tooltip.css("border-width")) * 2,
							q = i - A - I;
						n.$tooltip.css("width", q + "px");
						a = n.$tooltip.outerHeight(false);
						F = s.offset.top + a - (s.offset.top + s.dimension.height);
						M = s.offset.top - F / 2 - _
					} else if (A + o > i) {
						A = s.offset.left - D - o - 12;
						r = "right"
					}
				}
				if (n.options.arrow) {
					var R = "tooltipster-arrow-" + P;
					if (n.options.arrowColor.length < 1) {
						var U = n.$tooltip.css("background-color")
					} else {
						var U = n.options.arrowColor
					}
					if (!r) {
						r = ""
					} else if (r == "left") {
						R = "tooltipster-arrow-right";
						r = ""
					} else if (r == "right") {
						R = "tooltipster-arrow-left";
						r = ""
					} else {
						r = "left:" + Math.round(r) + "px;"
					}
					if (P == "top" || P == "top-left" || P == "top-right") {
						var z = parseFloat(n.$tooltip.css("border-bottom-width")),
							W = n.$tooltip.css("border-bottom-color")
					} else if (P == "bottom" || P == "bottom-left" || P == "bottom-right") {
						var z = parseFloat(n.$tooltip.css("border-top-width")),
							W = n.$tooltip.css("border-top-color")
					} else if (P == "left") {
						var z = parseFloat(n.$tooltip.css("border-right-width")),
							W = n.$tooltip.css("border-right-color")
					} else if (P == "right") {
						var z = parseFloat(n.$tooltip.css("border-left-width")),
							W = n.$tooltip.css("border-left-color")
					} else {
						var z = parseFloat(n.$tooltip.css("border-bottom-width")),
							W = n.$tooltip.css("border-bottom-color")
					}
					if (z > 1) {
						z++
					}
					var X = "";
					if (z !== 0) {
						var V = "",
							J = "border-color: " + W + ";";
						if (R.indexOf("bottom") !== -1) {
							V = "margin-top: -" + Math.round(z) + "px;"
						} else if (R.indexOf("top") !== -1) {
							V = "margin-bottom: -" + Math.round(z) + "px;"
						} else if (R.indexOf("left") !== -1) {
							V = "margin-right: -" + Math.round(z) + "px;"
						} else if (R.indexOf("right") !== -1) {
							V = "margin-left: -" + Math.round(z) + "px;"
						}
						X = '<span class="tooltipster-arrow-border" style="' + V + " " + J + ';"></span>'
					}
					n.$tooltip.find(".tooltipster-arrow").remove();
					var K = '<div class="' + R + ' tooltipster-arrow" style="' + r + '">' + X + '<span style="border-color:' + U + ';"></span></div>';
					n.$tooltip.append(K)
				}
				n.$tooltip.css({
					top: Math.round(M) + "px",
					left: Math.round(A) + "px"
				})
			}
			return n
		},
		enable: function () {
			this.enabled = true;
			return this
		},
		disable: function () {
			this.hide();
			this.enabled = false;
			return this
		},
		destroy: function () {
			var t = this;
			t.hide();
			if (t.$el[0] !== t.$elProxy[0]) {
				t.$elProxy.remove()
			}
			t.$el.removeData(t.namespace).off("." + t.namespace);
			var n = t.$el.data("tooltipster-ns");
			if (n.length === 1) {
				var r = null;
				if (t.options.restoration === "previous") {
					r = t.$el.data("tooltipster-initialTitle")
				} else if (t.options.restoration === "current") {
					r = typeof t.Content === "string" ? t.Content : e("<div></div>").append(t.Content).html()
				}
				if (r) {
					t.$el.attr("title", r)
				}
				t.$el.removeClass("tooltipstered").removeData("tooltipster-ns").removeData("tooltipster-initialTitle")
			} else {
				n = e.grep(n, function (e, n) {
					return e !== t.namespace
				});
				t.$el.data("tooltipster-ns", n)
			}
			return t
		},
		elementIcon: function () {
			return this.$el[0] !== this.$elProxy[0] ? this.$elProxy[0] : undefined
		},
		elementTooltip: function () {
			return this.$tooltip ? this.$tooltip[0] : undefined
		},
		option: function (e, t) {
			if (typeof t == "undefined") return this.options[e];
			else {
				this.options[e] = t;
				return this
			}
		},
		status: function () {
			return this.Status
		}
	};
	e.fn[r] = function () {
		var t = arguments;
		if (this.length === 0) {
			if (typeof t[0] === "string") {
				var n = true;
				switch (t[0]) {
					case "setDefaults":
						e.extend(i, t[1]);
						break;
					default:
						n = false;
						break
				}
				if (n) return true;
				else return this
			} else {
				return this
			}
		} else {
			if (typeof t[0] === "string") {
				var r = "#*$~&";
				this.each(function () {
					var n = e(this).data("tooltipster-ns"),
						i = n ? e(this).data(n[0]) : null;
					if (i) {
						if (typeof i[t[0]] === "function") {
							var s = i[t[0]](t[1], t[2])
						} else {
							throw new Error('Unknown method .tooltipster("' + t[0] + '")')
						}
						if (s !== i) {
							r = s;
							return false
						}
					} else {
						throw new Error("You called Tooltipster's \"" + t[0] + '" method on an uninitialized element')
					}
				});
				return r !== "#*$~&" ? r : this
			} else {
				var o = [],
					u = t[0] && typeof t[0].multiple !== "undefined",
					a = u && t[0].multiple || !u && i.multiple,
					f = t[0] && typeof t[0].debug !== "undefined",
					l = f && t[0].debug || !f && i.debug;
				this.each(function () {
					var n = false,
						r = e(this).data("tooltipster-ns"),
						i = null;
					if (!r) {
						n = true
					} else if (a) {
						n = true
					} else if (l) {
						console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')
					}
					if (n) {
						i = new s(this, t[0]);
						if (!r) r = [];
						r.push(i.namespace);
						e(this).data("tooltipster-ns", r);
						e(this).data(i.namespace, i)
					}
					o.push(i)
				});
				if (a) return o;
				else return this
			}
		}
	};
	var u = !!("ontouchstart" in t);
	var a = false;
	e("body").one("mousemove", function () {
		a = true
	})
})(jQuery, window, document);
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function ($) {
	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch (e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function (key, value, options) {
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires,
					t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}
			return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
		}
		var result = key ? undefined : {};
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
			if (key && key === name) {
				result = read(cookie, value);
				break;
			}
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}
		$.cookie(key, '', $.extend({}, options, {
			expires: -1
		}));
		return !$.cookie(key);
	};
}));
(function ($) {
	$.session = {
		_id: null,
		_cookieCache: undefined,
		_init: function () {
			if (!window.name) {
				window.name = Math.random();
			}
			this._id = window.name;
			this._initCache();
			var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
			if (matches && document.location.protocol !== matches[1]) {
				this._clearSession();
				for (var key in this._cookieCache) {
					try {
						window.sessionStorage.setItem(key, this._cookieCache[key]);
					} catch (e) {};
				}
			}
			document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();
		},
		_generatePrefix: function () {
			return '__session:' + this._id + ':';
		},
		_initCache: function () {
			var cookies = document.cookie.split(';');
			this._cookieCache = {};
			for (var i in cookies) {
				var kv = cookies[i].split('=');
				if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
					this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
				}
			}
		},
		_setFallback: function (key, value, onceOnly) {
			var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
			if (onceOnly) {
				cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
			}
			document.cookie = cookie;
			this._cookieCache[key] = value;
			return this;
		},
		_getFallback: function (key) {
			if (!this._cookieCache) {
				this._initCache();
			}
			return this._cookieCache[key];
		},
		_clearFallback: function () {
			for (var i in this._cookieCache) {
				document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			}
			this._cookieCache = {};
		},
		_deleteFallback: function (key) {
			document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			delete this._cookieCache[key];
		},
		get: function (key) {
			return window.sessionStorage.getItem(key) || this._getFallback(key);
		},
		set: function (key, value, onceOnly) {
			try {
				window.sessionStorage.setItem(key, value);
			} catch (e) {}
			this._setFallback(key, value, onceOnly || false);
			return this;
		},
		'delete': function (key) {
			return this.remove(key);
		},
		remove: function (key) {
			try {
				window.sessionStorage.removeItem(key);
			} catch (e) {};
			this._deleteFallback(key);
			return this;
		},
		_clearSession: function () {
			try {
				window.sessionStorage.clear();
			} catch (e) {
				for (var i in window.sessionStorage) {
					window.sessionStorage.removeItem(i);
				}
			}
		},
		clear: function () {
			this._clearSession();
			this._clearFallback();
			return this;
		}
	};
	$.session._init();
})(jQuery);
/*! jQuery Validation Plugin - v1.13.1 - 10/14/2014
 * http://jqueryvalidation.org/
 * Copyright (c) 2014 Jörn Zaefferer; Licensed MIT */
! function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function (a) {
	a.extend(a.fn, {
		validate: function (b) {
			if (!this.length) return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
			var c = a.data(this[0], "validator");
			return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function (b) {
				c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
			}), this.submit(function (b) {
				function d() {
					var d, e;
					return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), e = c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), void 0 !== e ? e : !1) : !0
				}
				return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
			})), c)
		},
		valid: function () {
			var b, c;
			return a(this[0]).is("form") ? b = this.validate().form() : (b = !0, c = a(this[0].form).validate(), this.each(function () {
				b = c.element(this) && b
			})), b
		},
		removeAttrs: function (b) {
			var c = {},
				d = this;
			return a.each(b.split(/\s/), function (a, b) {
				c[b] = d.attr(b), d.removeAttr(b)
			}), c
		},
		rules: function (b, c) {
			var d, e, f, g, h, i, j = this[0];
			if (b) switch (d = a.data(j.form, "validator").settings, e = d.rules, f = a.validator.staticRules(j), b) {
				case "add":
					a.extend(f, a.validator.normalizeRule(c)), delete f.messages, e[j.name] = f, c.messages && (d.messages[j.name] = a.extend(d.messages[j.name], c.messages));
					break;
				case "remove":
					return c ? (i = {}, a.each(c.split(/\s/), function (b, c) {
						i[c] = f[c], delete f[c], "required" === c && a(j).removeAttr("aria-required")
					}), i) : (delete e[j.name], f)
			}
			return g = a.validator.normalizeRules(a.extend({}, a.validator.classRules(j), a.validator.attributeRules(j), a.validator.dataRules(j), a.validator.staticRules(j)), j), g.required && (h = g.required, delete g.required, g = a.extend({
				required: h
			}, g), a(j).attr("aria-required", "true")), g.remote && (h = g.remote, delete g.remote, g = a.extend(g, {
				remote: h
			})), g
		}
	}), a.extend(a.expr[":"], {
		blank: function (b) {
			return !a.trim("" + a(b).val())
		},
		filled: function (b) {
			return !!a.trim("" + a(b).val())
		},
		unchecked: function (b) {
			return !a(b).prop("checked")
		}
	}), a.validator = function (b, c) {
		this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
	}, a.validator.format = function (b, c) {
		return 1 === arguments.length ? function () {
			var c = a.makeArray(arguments);
			return c.unshift(b), a.validator.format.apply(this, c)
		} : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function (a, c) {
			b = b.replace(new RegExp("\\{" + a + "\\}", "g"), function () {
				return c
			})
		}), b)
	}, a.extend(a.validator, {
		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			validClass: "valid",
			errorElement: "label",
			focusCleanup: !1,
			focusInvalid: !0,
			errorContainer: a([]),
			errorLabelContainer: a([]),
			onsubmit: !0,
			ignore: ":hidden",
			ignoreTitle: !1,
			onfocusin: function (a) {
				this.lastActive = a, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(a)))
			},
			onfocusout: function (a) {
				this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
			},
			onkeyup: function (a, b) {
				(9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
			},
			onclick: function (a) {
				a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
			},
			highlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
			},
			unhighlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
			}
		},
		setDefaults: function (b) {
			a.extend(a.validator.defaults, b)
		},
		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date ( ISO ).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: a.validator.format("Please enter no more than {0} characters."),
			minlength: a.validator.format("Please enter at least {0} characters."),
			rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
			range: a.validator.format("Please enter a value between {0} and {1}."),
			max: a.validator.format("Please enter a value less than or equal to {0}."),
			min: a.validator.format("Please enter a value greater than or equal to {0}.")
		},
		autoCreateRanges: !1,
		prototype: {
			init: function () {
				function b(b) {
					var c = a.data(this[0].form, "validator"),
						d = "on" + b.type.replace(/^validate/, ""),
						e = c.settings;
					e[d] && !this.is(e.ignore) && e[d].call(c, this[0], b)
				}
				this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
				var c, d = this.groups = {};
				a.each(this.settings.groups, function (b, c) {
					"string" == typeof c && (c = c.split(/\s/)), a.each(c, function (a, c) {
						d[c] = b
					})
				}), c = this.settings.rules, a.each(c, function (b, d) {
					c[b] = a.validator.normalizeRule(d)
				}), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", b).validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", b), this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler), a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
			},
			form: function () {
				return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
			},
			checkForm: function () {
				this.prepareForm();
				for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
				return this.valid()
			},
			element: function (b) {
				var c = this.clean(b),
					d = this.validationTargetFor(c),
					e = !0;
				return this.lastElement = d, void 0 === d ? delete this.invalid[c.name] : (this.prepareElement(d), this.currentElements = a(d), e = this.check(d) !== !1, e ? delete this.invalid[d.name] : this.invalid[d.name] = !0), a(b).attr("aria-invalid", !e), this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), e
			},
			showErrors: function (b) {
				if (b) {
					a.extend(this.errorMap, b), this.errorList = [];
					for (var c in b) this.errorList.push({
						message: b[c],
						element: this.findByName(c)[0]
					});
					this.successList = a.grep(this.successList, function (a) {
						return !(a.name in b)
					})
				}
				this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
			},
			resetForm: function () {
				a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")
			},
			numberOfInvalids: function () {
				return this.objectLength(this.invalid)
			},
			objectLength: function (a) {
				var b, c = 0;
				for (b in a) c++;
				return c
			},
			hideErrors: function () {
				this.hideThese(this.toHide)
			},
			hideThese: function (a) {
				a.not(this.containers).text(""), this.addWrapper(a).hide()
			},
			valid: function () {
				return 0 === this.size()
			},
			size: function () {
				return this.errorList.length
			},
			focusInvalid: function () {
				if (this.settings.focusInvalid) try {
					a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
				} catch (b) {}
			},
			findLastActive: function () {
				var b = this.lastActive;
				return b && 1 === a.grep(this.errorList, function (a) {
					return a.element.name === b.name
				}).length && b
			},
			elements: function () {
				var b = this,
					c = {};
				return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function () {
					return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0)
				})
			},
			clean: function (b) {
				return a(b)[0]
			},
			errors: function () {
				var b = this.settings.errorClass.split(" ").join(".");
				return a(this.settings.errorElement + "." + b, this.errorContext)
			},
			reset: function () {
				this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([]), this.currentElements = a([])
			},
			prepareForm: function () {
				this.reset(), this.toHide = this.errors().add(this.containers)
			},
			prepareElement: function (a) {
				this.reset(), this.toHide = this.errorsFor(a)
			},
			elementValue: function (b) {
				var c, d = a(b),
					e = b.type;
				return "radio" === e || "checkbox" === e ? a("input[name='" + b.name + "']:checked").val() : "number" === e && "undefined" != typeof b.validity ? b.validity.badInput ? !1 : d.val() : (c = d.val(), "string" == typeof c ? c.replace(/\r/g, "") : c)
			},
			check: function (b) {
				b = this.validationTargetFor(this.clean(b));
				var c, d, e, f = a(b).rules(),
					g = a.map(f, function (a, b) {
						return b
					}).length,
					h = !1,
					i = this.elementValue(b);
				for (d in f) {
					e = {
						method: d,
						parameters: f[d]
					};
					try {
						if (c = a.validator.methods[d].call(this, i, b, e.parameters), "dependency-mismatch" === c && 1 === g) {
							h = !0;
							continue
						}
						if (h = !1, "pending" === c) return void(this.toHide = this.toHide.not(this.errorsFor(b)));
						if (!c) return this.formatAndAdd(b, e), !1
					} catch (j) {
						throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method.", j), j
					}
				}
				if (!h) return this.objectLength(f) && this.successList.push(b), !0
			},
			customDataMessage: function (b, c) {
				return a(b).data("msg" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()) || a(b).data("msg")
			},
			customMessage: function (a, b) {
				var c = this.settings.messages[a];
				return c && (c.constructor === String ? c : c[b])
			},
			findDefined: function () {
				for (var a = 0; a < arguments.length; a++)
					if (void 0 !== arguments[a]) return arguments[a];
				return void 0
			},
			defaultMessage: function (b, c) {
				return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
			},
			formatAndAdd: function (b, c) {
				var d = this.defaultMessage(b, c.method),
					e = /\$?\{(\d+)\}/g;
				"function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), this.errorList.push({
					message: d,
					element: b,
					method: c.method
				}), this.errorMap[b.name] = d, this.submitted[b.name] = d
			},
			addWrapper: function (a) {
				return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
			},
			defaultShowErrors: function () {
				var a, b, c;
				for (a = 0; this.errorList[a]; a++) c = this.errorList[a], this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message);
				if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
					for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
				if (this.settings.unhighlight)
					for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
				this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
			},
			validElements: function () {
				return this.currentElements.not(this.invalidElements())
			},
			invalidElements: function () {
				return a(this.errorList).map(function () {
					return this.element
				})
			},
			showLabel: function (b, c) {
				var d, e, f, g = this.errorsFor(b),
					h = this.idOrName(b),
					i = a(b).attr("aria-describedby");
				g.length ? (g.removeClass(this.settings.validClass).addClass(this.settings.errorClass), g.html(c)) : (g = a("<" + this.settings.errorElement + ">").attr("id", h + "-error").addClass(this.settings.errorClass).html(c || ""), d = g, this.settings.wrapper && (d = g.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(d) : this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b), g.is("label") ? g.attr("for", h) : 0 === g.parents("label[for='" + h + "']").length && (f = g.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"), i ? i.match(new RegExp("\\b" + f + "\\b")) || (i += " " + f) : i = f, a(b).attr("aria-describedby", i), e = this.groups[b.name], e && a.each(this.groups, function (b, c) {
					c === e && a("[name='" + b + "']", this.currentForm).attr("aria-describedby", g.attr("id"))
				}))), !c && this.settings.success && (g.text(""), "string" == typeof this.settings.success ? g.addClass(this.settings.success) : this.settings.success(g, b)), this.toShow = this.toShow.add(g)
			},
			errorsFor: function (b) {
				var c = this.idOrName(b),
					d = a(b).attr("aria-describedby"),
					e = "label[for='" + c + "'], label[for='" + c + "'] *";
				return d && (e = e + ", #" + d.replace(/\s+/g, ", #")), this.errors().filter(e)
			},
			idOrName: function (a) {
				return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
			},
			validationTargetFor: function (b) {
				return this.checkable(b) && (b = this.findByName(b.name)), a(b).not(this.settings.ignore)[0]
			},
			checkable: function (a) {
				return /radio|checkbox/i.test(a.type)
			},
			findByName: function (b) {
				return a(this.currentForm).find("[name='" + b + "']")
			},
			getLength: function (b, c) {
				switch (c.nodeName.toLowerCase()) {
					case "select":
						return a("option:selected", c).length;
					case "input":
						if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
				}
				return b.length
			},
			depend: function (a, b) {
				return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
			},
			dependTypes: {
				"boolean": function (a) {
					return a
				},
				string: function (b, c) {
					return !!a(b, c.form).length
				},
				"function": function (a, b) {
					return a(b)
				}
			},
			optional: function (b) {
				var c = this.elementValue(b);
				return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
			},
			startRequest: function (a) {
				this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
			},
			stopRequest: function (b, c) {
				this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[b.name], c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
			},
			previousValue: function (b) {
				return a.data(b, "previousValue") || a.data(b, "previousValue", {
					old: null,
					valid: !0,
					message: this.defaultMessage(b, "remote")
				})
			}
		},
		classRuleSettings: {
			required: {
				required: !0
			},
			email: {
				email: !0
			},
			url: {
				url: !0
			},
			date: {
				date: !0
			},
			dateISO: {
				dateISO: !0
			},
			number: {
				number: !0
			},
			digits: {
				digits: !0
			},
			creditcard: {
				creditcard: !0
			}
		},
		addClassRules: function (b, c) {
			b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
		},
		classRules: function (b) {
			var c = {},
				d = a(b).attr("class");
			return d && a.each(d.split(" "), function () {
				this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
			}), c
		},
		attributeRules: function (b) {
			var c, d, e = {},
				f = a(b),
				g = b.getAttribute("type");
			for (c in a.validator.methods) "required" === c ? (d = b.getAttribute(c), "" === d && (d = !0), d = !!d) : d = f.attr(c), /min|max/.test(c) && (null === g || /number|range|text/.test(g)) && (d = Number(d)), d || 0 === d ? e[c] = d : g === c && "range" !== g && (e[c] = !0);
			return e.maxlength && /-1|2147483647|524288/.test(e.maxlength) && delete e.maxlength, e
		},
		dataRules: function (b) {
			var c, d, e = {},
				f = a(b);
			for (c in a.validator.methods) d = f.data("rule" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()), void 0 !== d && (e[c] = d);
			return e
		},
		staticRules: function (b) {
			var c = {},
				d = a.data(b.form, "validator");
			return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
		},
		normalizeRules: function (b, c) {
			return a.each(b, function (d, e) {
				if (e === !1) return void delete b[d];
				if (e.param || e.depends) {
					var f = !0;
					switch (typeof e.depends) {
						case "string":
							f = !!a(e.depends, c.form).length;
							break;
						case "function":
							f = e.depends.call(c, c)
					}
					f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
				}
			}), a.each(b, function (d, e) {
				b[d] = a.isFunction(e) ? e(c) : e
			}), a.each(["minlength", "maxlength"], function () {
				b[this] && (b[this] = Number(b[this]))
			}), a.each(["rangelength", "range"], function () {
				var c;
				b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].replace(/[\[\]]/g, "").split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
			}), a.validator.autoCreateRanges && (null != b.min && null != b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), null != b.minlength && null != b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
		},
		normalizeRule: function (b) {
			if ("string" == typeof b) {
				var c = {};
				a.each(b.split(/\s/), function () {
					c[this] = !0
				}), b = c
			}
			return b
		},
		addMethod: function (b, c, d) {
			a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b))
		},
		methods: {
			required: function (b, c, d) {
				if (!this.depend(d, c)) return "dependency-mismatch";
				if ("select" === c.nodeName.toLowerCase()) {
					var e = a(c).val();
					return e && e.length > 0
				}
				return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
			},
			email: function (a, b) {
				return this.optional(b) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)
			},
			url: function (a, b) {
				return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
			},
			date: function (a, b) {
				return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString())
			},
			dateISO: function (a, b) {
				return this.optional(b) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)
			},
			number: function (a, b) {
				return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
			},
			digits: function (a, b) {
				return this.optional(b) || /^\d+$/.test(a)
			},
			creditcard: function (a, b) {
				if (this.optional(b)) return "dependency-mismatch";
				if (/[^0-9 \-]+/.test(a)) return !1;
				var c, d, e = 0,
					f = 0,
					g = !1;
				if (a = a.replace(/\D/g, ""), a.length < 13 || a.length > 19) return !1;
				for (c = a.length - 1; c >= 0; c--) d = a.charAt(c), f = parseInt(d, 10), g && (f *= 2) > 9 && (f -= 9), e += f, g = !g;
				return e % 10 === 0
			},
			minlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || e >= d
			},
			maxlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || d >= e
			},
			rangelength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || e >= d[0] && e <= d[1]
			},
			min: function (a, b, c) {
				return this.optional(b) || a >= c
			},
			max: function (a, b, c) {
				return this.optional(b) || c >= a
			},
			range: function (a, b, c) {
				return this.optional(b) || a >= c[0] && a <= c[1]
			},
			equalTo: function (b, c, d) {
				var e = a(d);
				return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
					a(c).valid()
				}), b === e.val()
			},
			remote: function (b, c, d) {
				if (this.optional(c)) return "dependency-mismatch";
				var e, f, g = this.previousValue(c);
				return this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), g.originalMessage = this.settings.messages[c.name].remote, this.settings.messages[c.name].remote = g.message, d = "string" == typeof d && {
					url: d
				} || d, g.old === b ? g.valid : (g.old = b, e = this, this.startRequest(c), f = {}, f[c.name] = b, a.ajax(a.extend(!0, {
					url: d,
					mode: "abort",
					port: "validate" + c.name,
					dataType: "json",
					data: f,
					context: e.currentForm,
					success: function (d) {
						var f, h, i, j = d === !0 || "true" === d;
						e.settings.messages[c.name].remote = g.originalMessage, j ? (i = e.formSubmitted, e.prepareElement(c), e.formSubmitted = i, e.successList.push(c), delete e.invalid[c.name], e.showErrors()) : (f = {}, h = d || e.defaultMessage(c, "remote"), f[c.name] = g.message = a.isFunction(h) ? h(b) : h, e.invalid[c.name] = !0, e.showErrors(f)), g.valid = j, e.stopRequest(c, j)
					}
				}, d)), "pending")
			}
		}
	}), a.format = function () {
		throw "$.format has been deprecated. Please use $.validator.format instead."
	};
	var b, c = {};
	a.ajaxPrefilter ? a.ajaxPrefilter(function (a, b, d) {
		var e = a.port;
		"abort" === a.mode && (c[e] && c[e].abort(), c[e] = d)
	}) : (b = a.ajax, a.ajax = function (d) {
		var e = ("mode" in d ? d : a.ajaxSettings).mode,
			f = ("port" in d ? d : a.ajaxSettings).port;
		return "abort" === e ? (c[f] && c[f].abort(), c[f] = b.apply(this, arguments), c[f]) : b.apply(this, arguments)
	}), a.extend(a.fn, {
		validateDelegate: function (b, c, d) {
			return this.bind(c, function (c) {
				var e = a(c.target);
				return e.is(b) ? d.apply(e, arguments) : void 0
			})
		}
	})
});
/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
! function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function (a) {
	function b(b) {
		var g = b || window.event,
			h = i.call(arguments, 1),
			j = 0,
			l = 0,
			m = 0,
			n = 0,
			o = 0,
			p = 0;
		if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
			if (1 === g.deltaMode) {
				var q = a.data(this, "mousewheel-line-height");
				j *= q, m *= q, l *= q
			} else if (2 === g.deltaMode) {
				var r = a.data(this, "mousewheel-page-height");
				j *= r, m *= r, l *= r
			}
			if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
				var s = this.getBoundingClientRect();
				o = b.clientX - s.left, p = b.clientY - s.top
			}
			return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
		}
	}

	function c() {
		f = null
	}

	function d(a, b) {
		return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
	}
	var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		i = Array.prototype.slice;
	if (a.event.fixHooks)
		for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
	var k = a.event.special.mousewheel = {
		version: "3.1.12",
		setup: function () {
			if (this.addEventListener)
				for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
			else this.onmousewheel = b;
			a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
		},
		teardown: function () {
			if (this.removeEventListener)
				for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
			else this.onmousewheel = null;
			a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function (b) {
			var c = a(b),
				d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
			return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
		},
		getPageHeight: function (b) {
			return a(b).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	a.fn.extend({
		mousewheel: function (a) {
			return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
		},
		unmousewheel: function (a) {
			return this.unbind("mousewheel", a)
		}
	})
});
! function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function (a) {
	function b(b) {
		var g = b || window.event,
			h = i.call(arguments, 1),
			j = 0,
			l = 0,
			m = 0,
			n = 0,
			o = 0,
			p = 0;
		if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
			if (1 === g.deltaMode) {
				var q = a.data(this, "mousewheel-line-height");
				j *= q, m *= q, l *= q
			} else if (2 === g.deltaMode) {
				var r = a.data(this, "mousewheel-page-height");
				j *= r, m *= r, l *= r
			}
			if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
				var s = this.getBoundingClientRect();
				o = b.clientX - s.left, p = b.clientY - s.top
			}
			return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
		}
	}

	function c() {
		f = null
	}

	function d(a, b) {
		return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
	}
	var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		i = Array.prototype.slice;
	if (a.event.fixHooks)
		for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
	var k = a.event.special.mousewheel = {
		version: "3.1.12",
		setup: function () {
			if (this.addEventListener)
				for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
			else this.onmousewheel = b;
			a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
		},
		teardown: function () {
			if (this.removeEventListener)
				for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
			else this.onmousewheel = null;
			a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function (b) {
			var c = a(b),
				d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
			return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
		},
		getPageHeight: function (b) {
			return a(b).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	a.fn.extend({
		mousewheel: function (a) {
			return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
		},
		unmousewheel: function (a) {
			return this.unbind("mousewheel", a)
		}
	})
});
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
! function (e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document)
}(function (e) {
	! function (t) {
		var o = "function" == typeof define && define.amd,
			a = "undefined" != typeof module && module.exports,
			n = "https:" == document.location.protocol ? "https:" : "http:",
			i = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
		o || (a ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + n + "//" + i + "%3E%3C/script%3E"))), t()
	}(function () {
		var t, o = "mCustomScrollbar",
			a = "mCS",
			n = ".mCustomScrollbar",
			i = {
				setTop: 0,
				setLeft: 0,
				axis: "y",
				scrollbarPosition: "inside",
				scrollInertia: 950,
				autoDraggerLength: !0,
				alwaysShowScrollbar: 0,
				snapOffset: 0,
				mouseWheel: {
					enable: !0,
					scrollAmount: "auto",
					axis: "y",
					deltaFactor: "auto",
					disableOver: ["select", "option", "keygen", "datalist", "textarea"]
				},
				scrollButtons: {
					scrollType: "stepless",
					scrollAmount: "auto"
				},
				keyboard: {
					enable: !0,
					scrollType: "stepless",
					scrollAmount: "auto"
				},
				contentTouchScroll: 25,
				documentTouchScroll: !0,
				advanced: {
					autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
					updateOnContentResize: !0,
					updateOnImageLoad: "auto",
					autoUpdateTimeout: 60
				},
				theme: "light",
				callbacks: {
					onTotalScrollOffset: 0,
					onTotalScrollBackOffset: 0,
					alwaysTriggerOffsets: !0
				}
			},
			r = 0,
			l = {},
			s = window.attachEvent && !window.addEventListener ? 1 : 0,
			c = !1,
			d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"],
			u = {
				init: function (t) {
					var t = e.extend(!0, {}, i, t),
						o = f.call(this);
					if (t.live) {
						var s = t.liveSelector || this.selector || n,
							c = e(s);
						if ("off" === t.live) return void m(s);
						l[s] = setTimeout(function () {
							c.mCustomScrollbar(t), "once" === t.live && c.length && m(s)
						}, 500)
					} else m(s);
					return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : p(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = {
						enable: !0,
						scrollAmount: "auto",
						axis: "y",
						preventDefault: !1,
						deltaFactor: "auto",
						normalizeDelta: !1,
						invert: !1
					}), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = g(t.scrollButtons.scrollType), h(t), e(o).each(function () {
						var o = e(this);
						if (!o.data(a)) {
							o.data(a, {
								idx: ++r,
								opt: t,
								scrollRatio: {
									y: null,
									x: null
								},
								overflowed: null,
								contentReset: {
									y: null,
									x: null
								},
								bindEvents: !1,
								tweenRunning: !1,
								sequential: {},
								langDir: o.css("direction"),
								cbOffsets: null,
								trigger: null,
								poll: {
									size: {
										o: 0,
										n: 0
									},
									img: {
										o: 0,
										n: 0
									},
									change: {
										o: 0,
										n: 0
									}
								}
							});
							var n = o.data(a),
								i = n.opt,
								l = o.data("mcs-axis"),
								s = o.data("mcs-scrollbar-position"),
								c = o.data("mcs-theme");
							l && (i.axis = l), s && (i.scrollbarPosition = s), c && (i.theme = c, h(i)), v.call(this), n && i.callbacks.onCreate && "function" == typeof i.callbacks.onCreate && i.callbacks.onCreate.call(this), e("#mCSB_" + n.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, o)
						}
					})
				},
				update: function (t, o) {
					var n = t || f.call(this);
					return e(n).each(function () {
						var t = e(this);
						if (t.data(a)) {
							var n = t.data(a),
								i = n.opt,
								r = e("#mCSB_" + n.idx + "_container"),
								l = e("#mCSB_" + n.idx),
								s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")];
							if (!r.length) return;
							n.tweenRunning && Q(t), o && n && i.callbacks.onBeforeUpdate && "function" == typeof i.callbacks.onBeforeUpdate && i.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), l.css("max-height", "none"), l.height() !== t.height() && l.css("max-height", t.height()), _.call(this), "y" === i.axis || i.advanced.autoExpandHorizontalScroll || r.css("width", x(r)), n.overflowed = y.call(this), M.call(this), i.autoDraggerLength && S.call(this), b.call(this), T.call(this);
							var c = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)];
							"x" !== i.axis && (n.overflowed[0] ? s[0].height() > s[0].parent().height() ? B.call(this) : (G(t, c[0].toString(), {
								dir: "y",
								dur: 0,
								overwrite: "none"
							}), n.contentReset.y = null) : (B.call(this), "y" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[1] && G(t, c[1].toString(), {
								dir: "x",
								dur: 0,
								overwrite: "none"
							}))), "y" !== i.axis && (n.overflowed[1] ? s[1].width() > s[1].parent().width() ? B.call(this) : (G(t, c[1].toString(), {
								dir: "x",
								dur: 0,
								overwrite: "none"
							}), n.contentReset.x = null) : (B.call(this), "x" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[0] && G(t, c[0].toString(), {
								dir: "y",
								dur: 0,
								overwrite: "none"
							}))), o && n && (2 === o && i.callbacks.onImageLoad && "function" == typeof i.callbacks.onImageLoad ? i.callbacks.onImageLoad.call(this) : 3 === o && i.callbacks.onSelectorChange && "function" == typeof i.callbacks.onSelectorChange ? i.callbacks.onSelectorChange.call(this) : i.callbacks.onUpdate && "function" == typeof i.callbacks.onUpdate && i.callbacks.onUpdate.call(this)), N.call(this)
						}
					})
				},
				scrollTo: function (t, o) {
					if ("undefined" != typeof t && null != t) {
						var n = f.call(this);
						return e(n).each(function () {
							var n = e(this);
							if (n.data(a)) {
								var i = n.data(a),
									r = i.opt,
									l = {
										trigger: "external",
										scrollInertia: r.scrollInertia,
										scrollEasing: "mcsEaseInOut",
										moveDragger: !1,
										timeout: 60,
										callbacks: !0,
										onStart: !0,
										onUpdate: !0,
										onComplete: !0
									},
									s = e.extend(!0, {}, l, o),
									c = Y.call(this, t),
									d = s.scrollInertia > 0 && s.scrollInertia < 17 ? 17 : s.scrollInertia;
								c[0] = X.call(this, c[0], "y"), c[1] = X.call(this, c[1], "x"), s.moveDragger && (c[0] *= i.scrollRatio.y, c[1] *= i.scrollRatio.x), s.dur = ne() ? 0 : d, setTimeout(function () {
									null !== c[0] && "undefined" != typeof c[0] && "x" !== r.axis && i.overflowed[0] && (s.dir = "y", s.overwrite = "all", G(n, c[0].toString(), s)), null !== c[1] && "undefined" != typeof c[1] && "y" !== r.axis && i.overflowed[1] && (s.dir = "x", s.overwrite = "none", G(n, c[1].toString(), s))
								}, s.timeout)
							}
						})
					}
				},
				stop: function () {
					var t = f.call(this);
					return e(t).each(function () {
						var t = e(this);
						t.data(a) && Q(t)
					})
				},
				disable: function (t) {
					var o = f.call(this);
					return e(o).each(function () {
						var o = e(this);
						if (o.data(a)) {
							o.data(a);
							N.call(this, "remove"), k.call(this), t && B.call(this), M.call(this, !0), o.addClass(d[3])
						}
					})
				},
				destroy: function () {
					var t = f.call(this);
					return e(t).each(function () {
						var n = e(this);
						if (n.data(a)) {
							var i = n.data(a),
								r = i.opt,
								l = e("#mCSB_" + i.idx),
								s = e("#mCSB_" + i.idx + "_container"),
								c = e(".mCSB_" + i.idx + "_scrollbar");
							r.live && m(r.liveSelector || e(t).selector), N.call(this, "remove"), k.call(this), B.call(this), n.removeData(a), $(this, "mcs"), c.remove(), s.find("img." + d[2]).removeClass(d[2]), l.replaceWith(s.contents()), n.removeClass(o + " _" + a + "_" + i.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4])
						}
					})
				}
			},
			f = function () {
				return "object" != typeof e(this) || e(this).length < 1 ? n : this
			},
			h = function (t) {
				var o = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"],
					a = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"],
					n = ["minimal", "minimal-dark"],
					i = ["minimal", "minimal-dark"],
					r = ["minimal", "minimal-dark"];
				t.autoDraggerLength = e.inArray(t.theme, o) > -1 ? !1 : t.autoDraggerLength, t.autoExpandScrollbar = e.inArray(t.theme, a) > -1 ? !1 : t.autoExpandScrollbar, t.scrollButtons.enable = e.inArray(t.theme, n) > -1 ? !1 : t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, i) > -1 ? !0 : t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, r) > -1 ? "outside" : t.scrollbarPosition
			},
			m = function (e) {
				l[e] && (clearTimeout(l[e]), $(l, e))
			},
			p = function (e) {
				return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y"
			},
			g = function (e) {
				return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless"
			},
			v = function () {
				var t = e(this),
					n = t.data(a),
					i = n.opt,
					r = i.autoExpandScrollbar ? " " + d[1] + "_expand" : "",
					l = ["<div id='mCSB_" + n.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_vertical" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + n.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_horizontal" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
					s = "yx" === i.axis ? "mCSB_vertical_horizontal" : "x" === i.axis ? "mCSB_horizontal" : "mCSB_vertical",
					c = "yx" === i.axis ? l[0] + l[1] : "x" === i.axis ? l[1] : l[0],
					u = "yx" === i.axis ? "<div id='mCSB_" + n.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "",
					f = i.autoHideScrollbar ? " " + d[6] : "",
					h = "x" !== i.axis && "rtl" === n.langDir ? " " + d[7] : "";
				i.setWidth && t.css("width", i.setWidth), i.setHeight && t.css("height", i.setHeight), i.setLeft = "y" !== i.axis && "rtl" === n.langDir ? "989999px" : i.setLeft, t.addClass(o + " _" + a + "_" + n.idx + f + h).wrapInner("<div id='mCSB_" + n.idx + "' class='mCustomScrollBox mCS-" + i.theme + " " + s + "'><div id='mCSB_" + n.idx + "_container' class='mCSB_container' style='position:relative; top:" + i.setTop + "; left:" + i.setLeft + ";' dir='" + n.langDir + "' /></div>");
				var m = e("#mCSB_" + n.idx),
					p = e("#mCSB_" + n.idx + "_container");
				"y" === i.axis || i.advanced.autoExpandHorizontalScroll || p.css("width", x(p)), "outside" === i.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), m.addClass("mCSB_outside").after(c)) : (m.addClass("mCSB_inside").append(c), p.wrap(u)), w.call(this);
				var g = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")];
				g[0].css("min-height", g[0].height()), g[1].css("min-width", g[1].width())
			},
			x = function (t) {
				var o = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function () {
						return e(this).outerWidth(!0)
					}).get())],
					a = t.parent().width();
				return o[0] > a ? o[0] : o[1] > a ? o[1] : "100%"
			},
			_ = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = e("#mCSB_" + o.idx + "_container");
				if (n.advanced.autoExpandHorizontalScroll && "y" !== n.axis) {
					i.css({
						width: "auto",
						"min-width": 0,
						"overflow-x": "scroll"
					});
					var r = Math.ceil(i[0].scrollWidth);
					3 === n.advanced.autoExpandHorizontalScroll || 2 !== n.advanced.autoExpandHorizontalScroll && r > i.parent().width() ? i.css({
						width: r,
						"min-width": "100%",
						"overflow-x": "inherit"
					}) : i.css({
						"overflow-x": "inherit",
						position: "absolute"
					}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
						width: Math.ceil(i[0].getBoundingClientRect().right + .4) - Math.floor(i[0].getBoundingClientRect().left),
						"min-width": "100%",
						position: "relative"
					}).unwrap()
				}
			},
			w = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = e(".mCSB_" + o.idx + "_scrollbar:first"),
					r = oe(n.scrollButtons.tabindex) ? "tabindex='" + n.scrollButtons.tabindex + "'" : "",
					l = ["<a href='#' class='" + d[13] + "' " + r + " />", "<a href='#' class='" + d[14] + "' " + r + " />", "<a href='#' class='" + d[15] + "' " + r + " />", "<a href='#' class='" + d[16] + "' " + r + " />"],
					s = ["x" === n.axis ? l[2] : l[0], "x" === n.axis ? l[3] : l[1], l[2], l[3]];
				n.scrollButtons.enable && i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])
			},
			S = function () {
				var t = e(this),
					o = t.data(a),
					n = e("#mCSB_" + o.idx),
					i = e("#mCSB_" + o.idx + "_container"),
					r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")],
					l = [n.height() / i.outerHeight(!1), n.width() / i.outerWidth(!1)],
					c = [parseInt(r[0].css("min-height")), Math.round(l[0] * r[0].parent().height()), parseInt(r[1].css("min-width")), Math.round(l[1] * r[1].parent().width())],
					d = s && c[1] < c[0] ? c[0] : c[1],
					u = s && c[3] < c[2] ? c[2] : c[3];
				r[0].css({
					height: d,
					"max-height": r[0].parent().height() - 10
				}).find(".mCSB_dragger_bar").css({
					"line-height": c[0] + "px"
				}), r[1].css({
					width: u,
					"max-width": r[1].parent().width() - 10
				})
			},
			b = function () {
				var t = e(this),
					o = t.data(a),
					n = e("#mCSB_" + o.idx),
					i = e("#mCSB_" + o.idx + "_container"),
					r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")],
					l = [i.outerHeight(!1) - n.height(), i.outerWidth(!1) - n.width()],
					s = [l[0] / (r[0].parent().height() - r[0].height()), l[1] / (r[1].parent().width() - r[1].width())];
				o.scrollRatio = {
					y: s[0],
					x: s[1]
				}
			},
			C = function (e, t, o) {
				var a = o ? d[0] + "_expanded" : "",
					n = e.closest(".mCSB_scrollTools");
				"active" === t ? (e.toggleClass(d[0] + " " + a), n.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), n.removeClass(d[1])) : (e.addClass(d[0]), n.addClass(d[1])))
			},
			y = function () {
				var t = e(this),
					o = t.data(a),
					n = e("#mCSB_" + o.idx),
					i = e("#mCSB_" + o.idx + "_container"),
					r = null == o.overflowed ? i.height() : i.outerHeight(!1),
					l = null == o.overflowed ? i.width() : i.outerWidth(!1),
					s = i[0].scrollHeight,
					c = i[0].scrollWidth;
				return s > r && (r = s), c > l && (l = c), [r > n.height(), l > n.width()]
			},
			B = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = e("#mCSB_" + o.idx),
					r = e("#mCSB_" + o.idx + "_container"),
					l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")];
				if (Q(t), ("x" !== n.axis && !o.overflowed[0] || "y" === n.axis && o.overflowed[0]) && (l[0].add(r).css("top", 0), G(t, "_resetY")), "y" !== n.axis && !o.overflowed[1] || "x" === n.axis && o.overflowed[1]) {
					var s = dx = 0;
					"rtl" === o.langDir && (s = i.width() - r.outerWidth(!1), dx = Math.abs(s / o.scrollRatio.x)), r.css("left", s), l[1].css("left", dx), G(t, "_resetX")
				}
			},
			T = function () {
				function t() {
					r = setTimeout(function () {
						e.event.special.mousewheel ? (clearTimeout(r), W.call(o[0])) : t()
					}, 100)
				}
				var o = e(this),
					n = o.data(a),
					i = n.opt;
				if (!n.bindEvents) {
					if (I.call(this), i.contentTouchScroll && D.call(this), E.call(this), i.mouseWheel.enable) {
						var r;
						t()
					}
					P.call(this), U.call(this), i.advanced.autoScrollOnFocus && H.call(this), i.scrollButtons.enable && F.call(this), i.keyboard.enable && q.call(this), n.bindEvents = !0
				}
			},
			k = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = a + "_" + o.idx,
					r = ".mCSB_" + o.idx + "_scrollbar",
					l = e("#mCSB_" + o.idx + ",#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper," + r + " ." + d[12] + ",#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal," + r + ">a"),
					s = e("#mCSB_" + o.idx + "_container");
				n.advanced.releaseDraggableSelectors && l.add(e(n.advanced.releaseDraggableSelectors)), n.advanced.extraDraggableSelectors && l.add(e(n.advanced.extraDraggableSelectors)), o.bindEvents && (e(document).add(e(!A() || top.document)).unbind("." + i), l.each(function () {
					e(this).unbind("." + i)
				}), clearTimeout(t[0]._focusTimeout), $(t[0], "_focusTimeout"), clearTimeout(o.sequential.step), $(o.sequential, "step"), clearTimeout(s[0].onCompleteTimeout), $(s[0], "onCompleteTimeout"), o.bindEvents = !1)
			},
			M = function (t) {
				var o = e(this),
					n = o.data(a),
					i = n.opt,
					r = e("#mCSB_" + n.idx + "_container_wrapper"),
					l = r.length ? r : e("#mCSB_" + n.idx + "_container"),
					s = [e("#mCSB_" + n.idx + "_scrollbar_vertical"), e("#mCSB_" + n.idx + "_scrollbar_horizontal")],
					c = [s[0].find(".mCSB_dragger"), s[1].find(".mCSB_dragger")];
				"x" !== i.axis && (n.overflowed[0] && !t ? (s[0].add(c[0]).add(s[0].children("a")).css("display", "block"), l.removeClass(d[8] + " " + d[10])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[0].css("display", "none"), l.removeClass(d[10])) : (s[0].css("display", "none"), l.addClass(d[10])), l.addClass(d[8]))), "y" !== i.axis && (n.overflowed[1] && !t ? (s[1].add(c[1]).add(s[1].children("a")).css("display", "block"), l.removeClass(d[9] + " " + d[11])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[1].css("display", "none"), l.removeClass(d[11])) : (s[1].css("display", "none"), l.addClass(d[11])), l.addClass(d[9]))), n.overflowed[0] || n.overflowed[1] ? o.removeClass(d[5]) : o.addClass(d[5])
			},
			O = function (t) {
				var o = t.type,
					a = t.target.ownerDocument !== document && null !== frameElement ? [e(frameElement).offset().top, e(frameElement).offset().left] : null,
					n = A() && t.target.ownerDocument !== top.document && null !== frameElement ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0];
				switch (o) {
					case "pointerdown":
					case "MSPointerDown":
					case "pointermove":
					case "MSPointerMove":
					case "pointerup":
					case "MSPointerUp":
						return a ? [t.originalEvent.pageY - a[0] + n[0], t.originalEvent.pageX - a[1] + n[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1];
					case "touchstart":
					case "touchmove":
					case "touchend":
						var i = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0],
							r = t.originalEvent.touches.length || t.originalEvent.changedTouches.length;
						return t.target.ownerDocument !== document ? [i.screenY, i.screenX, r > 1] : [i.pageY, i.pageX, r > 1];
					default:
						return a ? [t.pageY - a[0] + n[0], t.pageX - a[1] + n[1], !1] : [t.pageY, t.pageX, !1]
				}
			},
			I = function () {
				function t(e, t, a, n) {
					if (h[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, o.attr("id") === f[1]) var i = "x",
						s = (o[0].offsetLeft - t + n) * l.scrollRatio.x;
					else var i = "y",
						s = (o[0].offsetTop - e + a) * l.scrollRatio.y;
					G(r, s.toString(), {
						dir: i,
						drag: !0
					})
				}
				var o, n, i, r = e(this),
					l = r.data(a),
					d = l.opt,
					u = a + "_" + l.idx,
					f = ["mCSB_" + l.idx + "_dragger_vertical", "mCSB_" + l.idx + "_dragger_horizontal"],
					h = e("#mCSB_" + l.idx + "_container"),
					m = e("#" + f[0] + ",#" + f[1]),
					p = d.advanced.releaseDraggableSelectors ? m.add(e(d.advanced.releaseDraggableSelectors)) : m,
					g = d.advanced.extraDraggableSelectors ? e(!A() || top.document).add(e(d.advanced.extraDraggableSelectors)) : e(!A() || top.document);
				m.bind("contextmenu." + u, function (e) {
					e.preventDefault()
				}).bind("mousedown." + u + " touchstart." + u + " pointerdown." + u + " MSPointerDown." + u, function (t) {
					if (t.stopImmediatePropagation(), t.preventDefault(), ee(t)) {
						c = !0, s && (document.onselectstart = function () {
							return !1
						}), L.call(h, !1), Q(r), o = e(this);
						var a = o.offset(),
							l = O(t)[0] - a.top,
							u = O(t)[1] - a.left,
							f = o.height() + a.top,
							m = o.width() + a.left;
						f > l && l > 0 && m > u && u > 0 && (n = l, i = u), C(o, "active", d.autoExpandScrollbar)
					}
				}).bind("touchmove." + u, function (e) {
					e.stopImmediatePropagation(), e.preventDefault();
					var a = o.offset(),
						r = O(e)[0] - a.top,
						l = O(e)[1] - a.left;
					t(n, i, r, l)
				}), e(document).add(g).bind("mousemove." + u + " pointermove." + u + " MSPointerMove." + u, function (e) {
					if (o) {
						var a = o.offset(),
							r = O(e)[0] - a.top,
							l = O(e)[1] - a.left;
						if (n === r && i === l) return;
						t(n, i, r, l)
					}
				}).add(p).bind("mouseup." + u + " touchend." + u + " pointerup." + u + " MSPointerUp." + u, function () {
					o && (C(o, "active", d.autoExpandScrollbar), o = null), c = !1, s && (document.onselectstart = null), L.call(h, !0)
				})
			},
			D = function () {
				function o(e) {
					if (!te(e) || c || O(e)[2]) return void(t = 0);
					t = 1, b = 0, C = 0, d = 1, y.removeClass("mCS_touch_action");
					var o = I.offset();
					u = O(e)[0] - o.top, f = O(e)[1] - o.left, z = [O(e)[0], O(e)[1]]
				}

				function n(e) {
					if (te(e) && !c && !O(e)[2] && (T.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!C || b) && d)) {
						g = K();
						var t = M.offset(),
							o = O(e)[0] - t.top,
							a = O(e)[1] - t.left,
							n = "mcsLinearOut";
						if (E.push(o), W.push(a), z[2] = Math.abs(O(e)[0] - z[0]), z[3] = Math.abs(O(e)[1] - z[1]), B.overflowed[0]) var i = D[0].parent().height() - D[0].height(),
							r = u - o > 0 && o - u > -(i * B.scrollRatio.y) && (2 * z[3] < z[2] || "yx" === T.axis);
						if (B.overflowed[1]) var l = D[1].parent().width() - D[1].width(),
							h = f - a > 0 && a - f > -(l * B.scrollRatio.x) && (2 * z[2] < z[3] || "yx" === T.axis);
						r || h ? (U || e.preventDefault(), b = 1) : (C = 1, y.addClass("mCS_touch_action")), U && e.preventDefault(), w = "yx" === T.axis ? [u - o, f - a] : "x" === T.axis ? [null, f - a] : [u - o, null], I[0].idleTimer = 250, B.overflowed[0] && s(w[0], R, n, "y", "all", !0), B.overflowed[1] && s(w[1], R, n, "x", L, !0)
					}
				}

				function i(e) {
					if (!te(e) || c || O(e)[2]) return void(t = 0);
					t = 1, e.stopImmediatePropagation(), Q(y), p = K();
					var o = M.offset();
					h = O(e)[0] - o.top, m = O(e)[1] - o.left, E = [], W = []
				}

				function r(e) {
					if (te(e) && !c && !O(e)[2]) {
						d = 0, e.stopImmediatePropagation(), b = 0, C = 0, v = K();
						var t = M.offset(),
							o = O(e)[0] - t.top,
							a = O(e)[1] - t.left;
						if (!(v - g > 30)) {
							_ = 1e3 / (v - p);
							var n = "mcsEaseOut",
								i = 2.5 > _,
								r = i ? [E[E.length - 2], W[W.length - 2]] : [0, 0];
							x = i ? [o - r[0], a - r[1]] : [o - h, a - m];
							var u = [Math.abs(x[0]), Math.abs(x[1])];
							_ = i ? [Math.abs(x[0] / 4), Math.abs(x[1] / 4)] : [_, _];
							var f = [Math.abs(I[0].offsetTop) - x[0] * l(u[0] / _[0], _[0]), Math.abs(I[0].offsetLeft) - x[1] * l(u[1] / _[1], _[1])];
							w = "yx" === T.axis ? [f[0], f[1]] : "x" === T.axis ? [null, f[1]] : [f[0], null], S = [4 * u[0] + T.scrollInertia, 4 * u[1] + T.scrollInertia];
							var y = parseInt(T.contentTouchScroll) || 0;
							w[0] = u[0] > y ? w[0] : 0, w[1] = u[1] > y ? w[1] : 0, B.overflowed[0] && s(w[0], S[0], n, "y", L, !1), B.overflowed[1] && s(w[1], S[1], n, "x", L, !1)
						}
					}
				}

				function l(e, t) {
					var o = [1.5 * t, 2 * t, t / 1.5, t / 2];
					return e > 90 ? t > 4 ? o[0] : o[3] : e > 60 ? t > 3 ? o[3] : o[2] : e > 30 ? t > 8 ? o[1] : t > 6 ? o[0] : t > 4 ? t : o[2] : t > 8 ? t : o[3]
				}

				function s(e, t, o, a, n, i) {
					e && G(y, e.toString(), {
						dur: t,
						scrollEasing: o,
						dir: a,
						overwrite: n,
						drag: i
					})
				}
				var d, u, f, h, m, p, g, v, x, _, w, S, b, C, y = e(this),
					B = y.data(a),
					T = B.opt,
					k = a + "_" + B.idx,
					M = e("#mCSB_" + B.idx),
					I = e("#mCSB_" + B.idx + "_container"),
					D = [e("#mCSB_" + B.idx + "_dragger_vertical"), e("#mCSB_" + B.idx + "_dragger_horizontal")],
					E = [],
					W = [],
					R = 0,
					L = "yx" === T.axis ? "none" : "all",
					z = [],
					P = I.find("iframe"),
					H = ["touchstart." + k + " pointerdown." + k + " MSPointerDown." + k, "touchmove." + k + " pointermove." + k + " MSPointerMove." + k, "touchend." + k + " pointerup." + k + " MSPointerUp." + k],
					U = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction;
				I.bind(H[0], function (e) {
					o(e)
				}).bind(H[1], function (e) {
					n(e)
				}), M.bind(H[0], function (e) {
					i(e)
				}).bind(H[2], function (e) {
					r(e)
				}), P.length && P.each(function () {
					e(this).bind("load", function () {
						A(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function (e) {
							o(e), i(e)
						}).bind(H[1], function (e) {
							n(e)
						}).bind(H[2], function (e) {
							r(e)
						})
					})
				})
			},
			E = function () {
				function o() {
					return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0
				}

				function n(e, t, o) {
					d.type = o && i ? "stepped" : "stepless", d.scrollAmount = 10, j(r, e, t, "mcsLinearOut", o ? 60 : null)
				}
				var i, r = e(this),
					l = r.data(a),
					s = l.opt,
					d = l.sequential,
					u = a + "_" + l.idx,
					f = e("#mCSB_" + l.idx + "_container"),
					h = f.parent();
				f.bind("mousedown." + u, function () {
					t || i || (i = 1, c = !0)
				}).add(document).bind("mousemove." + u, function (e) {
					if (!t && i && o()) {
						var a = f.offset(),
							r = O(e)[0] - a.top + f[0].offsetTop,
							c = O(e)[1] - a.left + f[0].offsetLeft;
						r > 0 && r < h.height() && c > 0 && c < h.width() ? d.step && n("off", null, "stepped") : ("x" !== s.axis && l.overflowed[0] && (0 > r ? n("on", 38) : r > h.height() && n("on", 40)), "y" !== s.axis && l.overflowed[1] && (0 > c ? n("on", 37) : c > h.width() && n("on", 39)))
					}
				}).bind("mouseup." + u + " dragend." + u, function () {
					t || (i && (i = 0, n("off", null)), c = !1)
				})
			},
			W = function () {
				function t(t, a) {
					if (Q(o), !z(o, t.target)) {
						var r = "auto" !== i.mouseWheel.deltaFactor ? parseInt(i.mouseWheel.deltaFactor) : s && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100,
							d = i.scrollInertia;
						if ("x" === i.axis || "x" === i.mouseWheel.axis) var u = "x",
							f = [Math.round(r * n.scrollRatio.x), parseInt(i.mouseWheel.scrollAmount)],
							h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.width() ? .9 * l.width() : f[0],
							m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetLeft),
							p = c[1][0].offsetLeft,
							g = c[1].parent().width() - c[1].width(),
							v = "y" === i.mouseWheel.axis ? t.deltaY || a : t.deltaX;
						else var u = "y",
							f = [Math.round(r * n.scrollRatio.y), parseInt(i.mouseWheel.scrollAmount)],
							h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.height() ? .9 * l.height() : f[0],
							m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetTop),
							p = c[0][0].offsetTop,
							g = c[0].parent().height() - c[0].height(),
							v = t.deltaY || a;
						"y" === u && !n.overflowed[0] || "x" === u && !n.overflowed[1] || ((i.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (v = -v), i.mouseWheel.normalizeDelta && (v = 0 > v ? -1 : 1), (v > 0 && 0 !== p || 0 > v && p !== g || i.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 5 && !i.mouseWheel.normalizeDelta && (h = t.deltaFactor, d = 17), G(o, (m - v * h).toString(), {
							dir: u,
							dur: d
						}))
					}
				}
				if (e(this).data(a)) {
					var o = e(this),
						n = o.data(a),
						i = n.opt,
						r = a + "_" + n.idx,
						l = e("#mCSB_" + n.idx),
						c = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")],
						d = e("#mCSB_" + n.idx + "_container").find("iframe");
					d.length && d.each(function () {
						e(this).bind("load", function () {
							A(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + r, function (e, o) {
								t(e, o)
							})
						})
					}), l.bind("mousewheel." + r, function (e, o) {
						t(e, o)
					})
				}
			},
			R = new Object,
			A = function (t) {
				var o = !1,
					a = !1,
					n = null;
				if (void 0 === t ? a = "#empty" : void 0 !== e(t).attr("id") && (a = e(t).attr("id")), a !== !1 && void 0 !== R[a]) return R[a];
				if (t) {
					try {
						var i = t.contentDocument || t.contentWindow.document;
						n = i.body.innerHTML
					} catch (r) {}
					o = null !== n
				} else {
					try {
						var i = top.document;
						n = i.body.innerHTML
					} catch (r) {}
					o = null !== n
				}
				return a !== !1 && (R[a] = o), o
			},
			L = function (e) {
				var t = this.find("iframe");
				if (t.length) {
					var o = e ? "auto" : "none";
					t.css("pointer-events", o)
				}
			},
			z = function (t, o) {
				var n = o.nodeName.toLowerCase(),
					i = t.data(a).opt.mouseWheel.disableOver,
					r = ["select", "textarea"];
				return e.inArray(n, i) > -1 && !(e.inArray(n, r) > -1 && !e(o).is(":focus"))
			},
			P = function () {
				var t, o = e(this),
					n = o.data(a),
					i = a + "_" + n.idx,
					r = e("#mCSB_" + n.idx + "_container"),
					l = r.parent(),
					s = e(".mCSB_" + n.idx + "_scrollbar ." + d[12]);
				s.bind("mousedown." + i + " touchstart." + i + " pointerdown." + i + " MSPointerDown." + i, function (o) {
					c = !0, e(o.target).hasClass("mCSB_dragger") || (t = 1)
				}).bind("touchend." + i + " pointerup." + i + " MSPointerUp." + i, function () {
					c = !1
				}).bind("click." + i, function (a) {
					if (t && (t = 0, e(a.target).hasClass(d[12]) || e(a.target).hasClass("mCSB_draggerRail"))) {
						Q(o);
						var i = e(this),
							s = i.find(".mCSB_dragger");
						if (i.parent(".mCSB_scrollTools_horizontal").length > 0) {
							if (!n.overflowed[1]) return;
							var c = "x",
								u = a.pageX > s.offset().left ? -1 : 1,
								f = Math.abs(r[0].offsetLeft) - u * (.9 * l.width())
						} else {
							if (!n.overflowed[0]) return;
							var c = "y",
								u = a.pageY > s.offset().top ? -1 : 1,
								f = Math.abs(r[0].offsetTop) - u * (.9 * l.height())
						}
						G(o, f.toString(), {
							dir: c,
							scrollEasing: "mcsEaseInOut"
						})
					}
				})
			},
			H = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = a + "_" + o.idx,
					r = e("#mCSB_" + o.idx + "_container"),
					l = r.parent();
				r.bind("focusin." + i, function () {
					var o = e(document.activeElement),
						a = r.find(".mCustomScrollBox").length,
						i = 0;
					o.is(n.advanced.autoScrollOnFocus) && (Q(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = a ? (i + 17) * a : 0, t[0]._focusTimeout = setTimeout(function () {
						var e = [ae(o)[0], ae(o)[1]],
							a = [r[0].offsetTop, r[0].offsetLeft],
							s = [a[0] + e[0] >= 0 && a[0] + e[0] < l.height() - o.outerHeight(!1), a[1] + e[1] >= 0 && a[0] + e[1] < l.width() - o.outerWidth(!1)],
							c = "yx" !== n.axis || s[0] || s[1] ? "all" : "none";
						"x" === n.axis || s[0] || G(t, e[0].toString(), {
							dir: "y",
							scrollEasing: "mcsEaseInOut",
							overwrite: c,
							dur: i
						}), "y" === n.axis || s[1] || G(t, e[1].toString(), {
							dir: "x",
							scrollEasing: "mcsEaseInOut",
							overwrite: c,
							dur: i
						})
					}, t[0]._focusTimer))
				})
			},
			U = function () {
				var t = e(this),
					o = t.data(a),
					n = a + "_" + o.idx,
					i = e("#mCSB_" + o.idx + "_container").parent();
				i.bind("scroll." + n, function () {
					0 === i.scrollTop() && 0 === i.scrollLeft() || e(".mCSB_" + o.idx + "_scrollbar").css("visibility", "hidden")
				})
			},
			F = function () {
				var t = e(this),
					o = t.data(a),
					n = o.opt,
					i = o.sequential,
					r = a + "_" + o.idx,
					l = ".mCSB_" + o.idx + "_scrollbar",
					s = e(l + ">a");
				s.bind("contextmenu." + r, function (e) {
					e.preventDefault()
				}).bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function (a) {
					function r(e, o) {
						i.scrollAmount = n.scrollButtons.scrollAmount, j(t, e, o)
					}
					if (a.preventDefault(), ee(a)) {
						var l = e(this).attr("class");
						switch (i.type = n.scrollButtons.scrollType, a.type) {
							case "mousedown":
							case "touchstart":
							case "pointerdown":
							case "MSPointerDown":
								if ("stepped" === i.type) return;
								c = !0, o.tweenRunning = !1, r("on", l);
								break;
							case "mouseup":
							case "touchend":
							case "pointerup":
							case "MSPointerUp":
							case "mouseout":
							case "pointerout":
							case "MSPointerOut":
								if ("stepped" === i.type) return;
								c = !1, i.dir && r("off", l);
								break;
							case "click":
								if ("stepped" !== i.type || o.tweenRunning) return;
								r("on", l)
						}
					}
				})
			},
			q = function () {
				function t(t) {
					function a(e, t) {
						r.type = i.keyboard.scrollType, r.scrollAmount = i.keyboard.scrollAmount, "stepped" === r.type && n.tweenRunning || j(o, e, t)
					}
					switch (t.type) {
						case "blur":
							n.tweenRunning && r.dir && a("off", null);
							break;
						case "keydown":
						case "keyup":
							var l = t.keyCode ? t.keyCode : t.which,
								s = "on";
							if ("x" !== i.axis && (38 === l || 40 === l) || "y" !== i.axis && (37 === l || 39 === l)) {
								if ((38 === l || 40 === l) && !n.overflowed[0] || (37 === l || 39 === l) && !n.overflowed[1]) return;
								"keyup" === t.type && (s = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), a(s, l))
							} else if (33 === l || 34 === l) {
								if ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) {
									Q(o);
									var f = 34 === l ? -1 : 1;
									if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x",
										m = Math.abs(c[0].offsetLeft) - f * (.9 * d.width());
									else var h = "y",
										m = Math.abs(c[0].offsetTop) - f * (.9 * d.height());
									G(o, m.toString(), {
										dir: h,
										scrollEasing: "mcsEaseInOut"
									})
								}
							} else if ((35 === l || 36 === l) && !e(document.activeElement).is(u) && ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) {
								if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x",
									m = 35 === l ? Math.abs(d.width() - c.outerWidth(!1)) : 0;
								else var h = "y",
									m = 35 === l ? Math.abs(d.height() - c.outerHeight(!1)) : 0;
								G(o, m.toString(), {
									dir: h,
									scrollEasing: "mcsEaseInOut"
								})
							}
					}
				}
				var o = e(this),
					n = o.data(a),
					i = n.opt,
					r = n.sequential,
					l = a + "_" + n.idx,
					s = e("#mCSB_" + n.idx),
					c = e("#mCSB_" + n.idx + "_container"),
					d = c.parent(),
					u = "input,textarea,select,datalist,keygen,[contenteditable='true']",
					f = c.find("iframe"),
					h = ["blur." + l + " keydown." + l + " keyup." + l];
				f.length && f.each(function () {
					e(this).bind("load", function () {
						A(this) && e(this.contentDocument || this.contentWindow.document).bind(h[0], function (e) {
							t(e)
						})
					})
				}), s.attr("tabindex", "0").bind(h[0], function (e) {
					t(e)
				})
			},
			j = function (t, o, n, i, r) {
				function l(e) {
					u.snapAmount && (f.scrollAmount = u.snapAmount instanceof Array ? "x" === f.dir[0] ? u.snapAmount[1] : u.snapAmount[0] : u.snapAmount);
					var o = "stepped" !== f.type,
						a = r ? r : e ? o ? p / 1.5 : g : 1e3 / 60,
						n = e ? o ? 7.5 : 40 : 2.5,
						s = [Math.abs(h[0].offsetTop), Math.abs(h[0].offsetLeft)],
						d = [c.scrollRatio.y > 10 ? 10 : c.scrollRatio.y, c.scrollRatio.x > 10 ? 10 : c.scrollRatio.x],
						m = "x" === f.dir[0] ? s[1] + f.dir[1] * (d[1] * n) : s[0] + f.dir[1] * (d[0] * n),
						v = "x" === f.dir[0] ? s[1] + f.dir[1] * parseInt(f.scrollAmount) : s[0] + f.dir[1] * parseInt(f.scrollAmount),
						x = "auto" !== f.scrollAmount ? v : m,
						_ = i ? i : e ? o ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear",
						w = !!e;
					return e && 17 > a && (x = "x" === f.dir[0] ? s[1] : s[0]), G(t, x.toString(), {
						dir: f.dir[0],
						scrollEasing: _,
						dur: a,
						onComplete: w
					}), e ? void(f.dir = !1) : (clearTimeout(f.step), void(f.step = setTimeout(function () {
						l()
					}, a)))
				}

				function s() {
					clearTimeout(f.step), $(f, "step"), Q(t)
				}
				var c = t.data(a),
					u = c.opt,
					f = c.sequential,
					h = e("#mCSB_" + c.idx + "_container"),
					m = "stepped" === f.type,
					p = u.scrollInertia < 26 ? 26 : u.scrollInertia,
					g = u.scrollInertia < 1 ? 17 : u.scrollInertia;
				switch (o) {
					case "on":
						if (f.dir = [n === d[16] || n === d[15] || 39 === n || 37 === n ? "x" : "y", n === d[13] || n === d[15] || 38 === n || 37 === n ? -1 : 1], Q(t), oe(n) && "stepped" === f.type) return;
						l(m);
						break;
					case "off":
						s(), (m || c.tweenRunning && f.dir) && l(!0)
				}
			},
			Y = function (t) {
				var o = e(this).data(a).opt,
					n = [];
				return "function" == typeof t && (t = t()), t instanceof Array ? n = t.length > 1 ? [t[0], t[1]] : "x" === o.axis ? [null, t[0]] : [t[0], null] : (n[0] = t.y ? t.y : t.x || "x" === o.axis ? null : t, n[1] = t.x ? t.x : t.y || "y" === o.axis ? null : t), "function" == typeof n[0] && (n[0] = n[0]()), "function" == typeof n[1] && (n[1] = n[1]()), n
			},
			X = function (t, o) {
				if (null != t && "undefined" != typeof t) {
					var n = e(this),
						i = n.data(a),
						r = i.opt,
						l = e("#mCSB_" + i.idx + "_container"),
						s = l.parent(),
						c = typeof t;
					o || (o = "x" === r.axis ? "x" : "y");
					var d = "x" === o ? l.outerWidth(!1) - s.width() : l.outerHeight(!1) - s.height(),
						f = "x" === o ? l[0].offsetLeft : l[0].offsetTop,
						h = "x" === o ? "left" : "top";
					switch (c) {
						case "function":
							return t();
						case "object":
							var m = t.jquery ? t : e(t);
							if (!m.length) return;
							return "x" === o ? ae(m)[1] : ae(m)[0];
						case "string":
						case "number":
							if (oe(t)) return Math.abs(t);
							if (-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100);
							if (-1 !== t.indexOf("-=")) return Math.abs(f - parseInt(t.split("-=")[1]));
							if (-1 !== t.indexOf("+=")) {
								var p = f + parseInt(t.split("+=")[1]);
								return p >= 0 ? 0 : Math.abs(p)
							}
							if (-1 !== t.indexOf("px") && oe(t.split("px")[0])) return Math.abs(t.split("px")[0]);
							if ("top" === t || "left" === t) return 0;
							if ("bottom" === t) return Math.abs(s.height() - l.outerHeight(!1));
							if ("right" === t) return Math.abs(s.width() - l.outerWidth(!1));
							if ("first" === t || "last" === t) {
								var m = l.find(":" + t);
								return "x" === o ? ae(m)[1] : ae(m)[0]
							}
							return e(t).length ? "x" === o ? ae(e(t))[1] : ae(e(t))[0] : (l.css(h, t), void u.update.call(null, n[0]))
					}
				}
			},
			N = function (t) {
				function o() {
					return clearTimeout(f[0].autoUpdate), 0 === l.parents("html").length ? void(l = null) : void(f[0].autoUpdate = setTimeout(function () {
						return c.advanced.updateOnSelectorChange && (s.poll.change.n = i(), s.poll.change.n !== s.poll.change.o) ? (s.poll.change.o = s.poll.change.n, void r(3)) : c.advanced.updateOnContentResize && (s.poll.size.n = l[0].scrollHeight + l[0].scrollWidth + f[0].offsetHeight + l[0].offsetHeight + l[0].offsetWidth, s.poll.size.n !== s.poll.size.o) ? (s.poll.size.o = s.poll.size.n, void r(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (s.poll.img.n = f.find("img").length, s.poll.img.n === s.poll.img.o) ? void((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && o()) : (s.poll.img.o = s.poll.img.n, void f.find("img").each(function () {
							n(this)
						}))
					}, c.advanced.autoUpdateTimeout))
				}

				function n(t) {
					function o(e, t) {
						return function () {
							return t.apply(e, arguments)
						}
					}

					function a() {
						this.onload = null, e(t).addClass(d[2]), r(2)
					}
					if (e(t).hasClass(d[2])) return void r();
					var n = new Image;
					n.onload = o(n, a), n.src = t.src
				}

				function i() {
					c.advanced.updateOnSelectorChange === !0 && (c.advanced.updateOnSelectorChange = "*");
					var e = 0,
						t = f.find(c.advanced.updateOnSelectorChange);
					return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function () {
						e += this.offsetHeight + this.offsetWidth
					}), e
				}

				function r(e) {
					clearTimeout(f[0].autoUpdate), u.update.call(null, l[0], e)
				}
				var l = e(this),
					s = l.data(a),
					c = s.opt,
					f = e("#mCSB_" + s.idx + "_container");
				return t ? (clearTimeout(f[0].autoUpdate), void $(f[0], "autoUpdate")) : void o()
			},
			V = function (e, t, o) {
				return Math.round(e / t) * t - o
			},
			Q = function (t) {
				var o = t.data(a),
					n = e("#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper,#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal");
				n.each(function () {
					Z.call(this)
				})
			},
			G = function (t, o, n) {
				function i(e) {
					return s && c.callbacks[e] && "function" == typeof c.callbacks[e]
				}

				function r() {
					return [c.callbacks.alwaysTriggerOffsets || w >= S[0] + y, c.callbacks.alwaysTriggerOffsets || -B >= w]
				}

				function l() {
					var e = [h[0].offsetTop, h[0].offsetLeft],
						o = [x[0].offsetTop, x[0].offsetLeft],
						a = [h.outerHeight(!1), h.outerWidth(!1)],
						i = [f.height(), f.width()];
					t[0].mcs = {
						content: h,
						top: e[0],
						left: e[1],
						draggerTop: o[0],
						draggerLeft: o[1],
						topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(a[0]) - i[0])),
						leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(a[1]) - i[1])),
						direction: n.dir
					}
				}
				var s = t.data(a),
					c = s.opt,
					d = {
						trigger: "internal",
						dir: "y",
						scrollEasing: "mcsEaseOut",
						drag: !1,
						dur: c.scrollInertia,
						overwrite: "all",
						callbacks: !0,
						onStart: !0,
						onUpdate: !0,
						onComplete: !0
					},
					n = e.extend(d, n),
					u = [n.dur, n.drag ? 0 : n.dur],
					f = e("#mCSB_" + s.idx),
					h = e("#mCSB_" + s.idx + "_container"),
					m = h.parent(),
					p = c.callbacks.onTotalScrollOffset ? Y.call(t, c.callbacks.onTotalScrollOffset) : [0, 0],
					g = c.callbacks.onTotalScrollBackOffset ? Y.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0];
				if (s.trigger = n.trigger, 0 === m.scrollTop() && 0 === m.scrollLeft() || (e(".mCSB_" + s.idx + "_scrollbar").css("visibility", "visible"), m.scrollTop(0).scrollLeft(0)), "_resetY" !== o || s.contentReset.y || (i("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), s.contentReset.y = 1), "_resetX" !== o || s.contentReset.x || (i("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), s.contentReset.x = 1), "_resetY" !== o && "_resetX" !== o) {
					if (!s.contentReset.y && t[0].mcs || !s.overflowed[0] || (i("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), s.contentReset.x = null), !s.contentReset.x && t[0].mcs || !s.overflowed[1] || (i("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), s.contentReset.x = null), c.snapAmount) {
						var v = c.snapAmount instanceof Array ? "x" === n.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount;
						o = V(o, v, c.snapOffset)
					}
					switch (n.dir) {
						case "x":
							var x = e("#mCSB_" + s.idx + "_dragger_horizontal"),
								_ = "left",
								w = h[0].offsetLeft,
								S = [f.width() - h.outerWidth(!1), x.parent().width() - x.width()],
								b = [o, 0 === o ? 0 : o / s.scrollRatio.x],
								y = p[1],
								B = g[1],
								T = y > 0 ? y / s.scrollRatio.x : 0,
								k = B > 0 ? B / s.scrollRatio.x : 0;
							break;
						case "y":
							var x = e("#mCSB_" + s.idx + "_dragger_vertical"),
								_ = "top",
								w = h[0].offsetTop,
								S = [f.height() - h.outerHeight(!1), x.parent().height() - x.height()],
								b = [o, 0 === o ? 0 : o / s.scrollRatio.y],
								y = p[0],
								B = g[0],
								T = y > 0 ? y / s.scrollRatio.y : 0,
								k = B > 0 ? B / s.scrollRatio.y : 0
					}
					b[1] < 0 || 0 === b[0] && 0 === b[1] ? b = [0, 0] : b[1] >= S[1] ? b = [S[0], S[1]] : b[0] = -b[0], t[0].mcs || (l(), i("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(h[0].onCompleteTimeout), J(x[0], _, Math.round(b[1]), u[1], n.scrollEasing), !s.tweenRunning && (0 === w && b[0] >= 0 || w === S[0] && b[0] <= S[0]) || J(h[0], _, Math.round(b[0]), u[0], n.scrollEasing, n.overwrite, {
						onStart: function () {
							n.callbacks && n.onStart && !s.tweenRunning && (i("onScrollStart") && (l(), c.callbacks.onScrollStart.call(t[0])), s.tweenRunning = !0, C(x), s.cbOffsets = r())
						},
						onUpdate: function () {
							n.callbacks && n.onUpdate && i("whileScrolling") && (l(), c.callbacks.whileScrolling.call(t[0]))
						},
						onComplete: function () {
							if (n.callbacks && n.onComplete) {
								"yx" === c.axis && clearTimeout(h[0].onCompleteTimeout);
								var e = h[0].idleTimer || 0;
								h[0].onCompleteTimeout = setTimeout(function () {
									i("onScroll") && (l(), c.callbacks.onScroll.call(t[0])), i("onTotalScroll") && b[1] >= S[1] - T && s.cbOffsets[0] && (l(), c.callbacks.onTotalScroll.call(t[0])), i("onTotalScrollBack") && b[1] <= k && s.cbOffsets[1] && (l(), c.callbacks.onTotalScrollBack.call(t[0])), s.tweenRunning = !1, h[0].idleTimer = 0, C(x, "hide")
								}, e)
							}
						}
					})
				}
			},
			J = function (e, t, o, a, n, i, r) {
				function l() {
					S.stop || (x || m.call(), x = K() - v, s(), x >= S.time && (S.time = x > S.time ? x + f - (x - S.time) : x + f - 1, S.time < x + 1 && (S.time = x + 1)), S.time < a ? S.id = h(l) : g.call())
				}

				function s() {
					a > 0 ? (S.currVal = u(S.time, _, b, a, n), w[t] = Math.round(S.currVal) + "px") : w[t] = o + "px", p.call()
				}

				function c() {
					f = 1e3 / 60, S.time = x + f, h = window.requestAnimationFrame ? window.requestAnimationFrame : function (e) {
						return s(), setTimeout(e, .01)
					}, S.id = h(l)
				}

				function d() {
					null != S.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(S.id) : clearTimeout(S.id), S.id = null)
				}

				function u(e, t, o, a, n) {
					switch (n) {
						case "linear":
						case "mcsLinear":
							return o * e / a + t;
						case "mcsLinearOut":
							return e /= a, e--, o * Math.sqrt(1 - e * e) + t;
						case "easeInOutSmooth":
							return e /= a / 2, 1 > e ? o / 2 * e * e + t : (e--, -o / 2 * (e * (e - 2) - 1) + t);
						case "easeInOutStrong":
							return e /= a / 2, 1 > e ? o / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, o / 2 * (-Math.pow(2, -10 * e) + 2) + t);
						case "easeInOut":
						case "mcsEaseInOut":
							return e /= a / 2, 1 > e ? o / 2 * e * e * e + t : (e -= 2, o / 2 * (e * e * e + 2) + t);
						case "easeOutSmooth":
							return e /= a, e--, -o * (e * e * e * e - 1) + t;
						case "easeOutStrong":
							return o * (-Math.pow(2, -10 * e / a) + 1) + t;
						case "easeOut":
						case "mcsEaseOut":
						default:
							var i = (e /= a) * e,
								r = i * e;
							return t + o * (.499999999999997 * r * i + -2.5 * i * i + 5.5 * r + -6.5 * i + 4 * e)
					}
				}
				e._mTween || (e._mTween = {
					top: {},
					left: {}
				});
				var f, h, r = r || {},
					m = r.onStart || function () {},
					p = r.onUpdate || function () {},
					g = r.onComplete || function () {},
					v = K(),
					x = 0,
					_ = e.offsetTop,
					w = e.style,
					S = e._mTween[t];
				"left" === t && (_ = e.offsetLeft);
				var b = o - _;
				S.stop = 0, "none" !== i && d(), c()
			},
			K = function () {
				return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime()
			},
			Z = function () {
				var e = this;
				e._mTween || (e._mTween = {
					top: {},
					left: {}
				});
				for (var t = ["top", "left"], o = 0; o < t.length; o++) {
					var a = t[o];
					e._mTween[a].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[a].id) : clearTimeout(e._mTween[a].id), e._mTween[a].id = null, e._mTween[a].stop = 1)
				}
			},
			$ = function (e, t) {
				try {
					delete e[t]
				} catch (o) {
					e[t] = null
				}
			},
			ee = function (e) {
				return !(e.which && 1 !== e.which)
			},
			te = function (e) {
				var t = e.originalEvent.pointerType;
				return !(t && "touch" !== t && 2 !== t)
			},
			oe = function (e) {
				return !isNaN(parseFloat(e)) && isFinite(e)
			},
			ae = function (e) {
				var t = e.parents(".mCSB_container");
				return [e.offset().top - t.offset().top, e.offset().left - t.offset().left]
			},
			ne = function () {
				function e() {
					var e = ["webkit", "moz", "ms", "o"];
					if ("hidden" in document) return "hidden";
					for (var t = 0; t < e.length; t++)
						if (e[t] + "Hidden" in document) return e[t] + "Hidden";
					return null
				}
				var t = e();
				return t ? document[t] : !1
			};
		e.fn[o] = function (t) {
			return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
		}, e[o] = function (t) {
			return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
		}, e[o].defaults = i, window[o] = !0, e(window).bind("load", function () {
			e(n)[o](), e.extend(e.expr[":"], {
				mcsInView: e.expr[":"].mcsInView || function (t) {
					var o, a, n = e(t),
						i = n.parents(".mCSB_container");
					if (i.length) return o = i.parent(), a = [i[0].offsetTop, i[0].offsetLeft], a[0] + ae(n)[0] >= 0 && a[0] + ae(n)[0] < o.height() - n.outerHeight(!1) && a[1] + ae(n)[1] >= 0 && a[1] + ae(n)[1] < o.width() - n.outerWidth(!1)
				},
				mcsInSight: e.expr[":"].mcsInSight || function (t, o, a) {
					var n, i, r, l, s = e(t),
						c = s.parents(".mCSB_container"),
						d = "exact" === a[3] ? [
							[1, 0],
							[1, 0]
						] : [
							[.9, .1],
							[.6, .4]
						];
					if (c.length) return n = [s.outerHeight(!1), s.outerWidth(!1)], r = [c[0].offsetTop + ae(s)[0], c[0].offsetLeft + ae(s)[1]], i = [c.parent()[0].offsetHeight, c.parent()[0].offsetWidth], l = [n[0] < i[0] ? d[0] : d[1], n[1] < i[1] ? d[0] : d[1]], r[0] - i[0] * l[0][0] < 0 && r[0] + n[0] - i[0] * l[0][1] >= 0 && r[1] - i[1] * l[1][0] < 0 && r[1] + n[1] - i[1] * l[1][1] >= 0
				},
				mcsOverflow: e.expr[":"].mcsOverflow || function (t) {
					var o = e(t).data(a);
					if (o) return o.overflowed[0] || o.overflowed[1]
				}
			})
		})
	})
});
/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */
! function (e, t, n) {
	typeof module != "undefined" && module.exports ? module.exports = n() : typeof define == "function" && define.amd ? define(t, n) : e[t] = n()
}(this, "bowser", function () {
	function t(t) {
		function n(e) {
			var n = t.match(e);
			return n && n.length > 1 && n[1] || ""
		}

		function r(e) {
			var n = t.match(e);
			return n && n.length > 1 && n[2] || ""
		}

		function N(e) {
			switch (e) {
				case "NT":
					return "NT";
				case "XP":
					return "XP";
				case "NT 5.0":
					return "2000";
				case "NT 5.1":
					return "XP";
				case "NT 5.2":
					return "2003";
				case "NT 6.0":
					return "Vista";
				case "NT 6.1":
					return "7";
				case "NT 6.2":
					return "8";
				case "NT 6.3":
					return "8.1";
				case "NT 10.0":
					return "10";
				default:
					return undefined
			}
		}
		var i = n(/(ipod|iphone|ipad)/i).toLowerCase(),
			s = /like android/i.test(t),
			o = !s && /android/i.test(t),
			u = /nexus\s*[0-6]\s*/i.test(t),
			a = !u && /nexus\s*[0-9]+/i.test(t),
			f = /CrOS/.test(t),
			l = /silk/i.test(t),
			c = /sailfish/i.test(t),
			h = /tizen/i.test(t),
			p = /(web|hpw)os/i.test(t),
			d = /windows phone/i.test(t),
			v = /SamsungBrowser/i.test(t),
			m = !d && /windows/i.test(t),
			g = !i && !l && /macintosh/i.test(t),
			y = !o && !c && !h && !p && /linux/i.test(t),
			b = r(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),
			w = n(/version\/(\d+(\.\d+)?)/i),
			E = /tablet/i.test(t) && !/tablet pc/i.test(t),
			S = !E && /[^-]mobi/i.test(t),
			x = /xbox/i.test(t),
			T;
		/opera/i.test(t) ? T = {
			name: "Opera",
			opera: e,
			version: w || n(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
		} : /opr\/|opios/i.test(t) ? T = {
			name: "Opera",
			opera: e,
			version: n(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || w
		} : /SamsungBrowser/i.test(t) ? T = {
			name: "Samsung Internet for Android",
			samsungBrowser: e,
			version: w || n(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
		} : /coast/i.test(t) ? T = {
			name: "Opera Coast",
			coast: e,
			version: w || n(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
		} : /yabrowser/i.test(t) ? T = {
			name: "Yandex Browser",
			yandexbrowser: e,
			version: w || n(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
		} : /ucbrowser/i.test(t) ? T = {
			name: "UC Browser",
			ucbrowser: e,
			version: n(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
		} : /mxios/i.test(t) ? T = {
			name: "Maxthon",
			maxthon: e,
			version: n(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
		} : /epiphany/i.test(t) ? T = {
			name: "Epiphany",
			epiphany: e,
			version: n(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
		} : /puffin/i.test(t) ? T = {
			name: "Puffin",
			puffin: e,
			version: n(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
		} : /sleipnir/i.test(t) ? T = {
			name: "Sleipnir",
			sleipnir: e,
			version: n(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
		} : /k-meleon/i.test(t) ? T = {
			name: "K-Meleon",
			kMeleon: e,
			version: n(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
		} : d ? (T = {
			name: "Windows Phone",
			osname: "Windows Phone",
			windowsphone: e
		}, b ? (T.msedge = e, T.version = b) : (T.msie = e, T.version = n(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(t) ? T = {
			name: "Internet Explorer",
			msie: e,
			version: n(/(?:msie |rv:)(\d+(\.\d+)?)/i)
		} : f ? T = {
			name: "Chrome",
			osname: "Chrome OS",
			chromeos: e,
			chromeBook: e,
			chrome: e,
			version: n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
		} : /edg([ea]|ios)/i.test(t) ? T = {
			name: "Microsoft Edge",
			msedge: e,
			version: b
		} : /vivaldi/i.test(t) ? T = {
			name: "Vivaldi",
			vivaldi: e,
			version: n(/vivaldi\/(\d+(\.\d+)?)/i) || w
		} : c ? T = {
			name: "Sailfish",
			osname: "Sailfish OS",
			sailfish: e,
			version: n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
		} : /seamonkey\//i.test(t) ? T = {
			name: "SeaMonkey",
			seamonkey: e,
			version: n(/seamonkey\/(\d+(\.\d+)?)/i)
		} : /firefox|iceweasel|fxios/i.test(t) ? (T = {
			name: "Firefox",
			firefox: e,
			version: n(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
		}, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t) && (T.firefoxos = e, T.osname = "Firefox OS")) : l ? T = {
			name: "Amazon Silk",
			silk: e,
			version: n(/silk\/(\d+(\.\d+)?)/i)
		} : /phantom/i.test(t) ? T = {
			name: "PhantomJS",
			phantom: e,
			version: n(/phantomjs\/(\d+(\.\d+)?)/i)
		} : /slimerjs/i.test(t) ? T = {
			name: "SlimerJS",
			slimer: e,
			version: n(/slimerjs\/(\d+(\.\d+)?)/i)
		} : /blackberry|\bbb\d+/i.test(t) || /rim\stablet/i.test(t) ? T = {
			name: "BlackBerry",
			osname: "BlackBerry OS",
			blackberry: e,
			version: w || n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
		} : p ? (T = {
			name: "WebOS",
			osname: "WebOS",
			webos: e,
			version: w || n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
		}, /touchpad\//i.test(t) && (T.touchpad = e)) : /bada/i.test(t) ? T = {
			name: "Bada",
			osname: "Bada",
			bada: e,
			version: n(/dolfin\/(\d+(\.\d+)?)/i)
		} : h ? T = {
			name: "Tizen",
			osname: "Tizen",
			tizen: e,
			version: n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || w
		} : /qupzilla/i.test(t) ? T = {
			name: "QupZilla",
			qupzilla: e,
			version: n(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || w
		} : /chromium/i.test(t) ? T = {
			name: "Chromium",
			chromium: e,
			version: n(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || w
		} : /chrome|crios|crmo/i.test(t) ? T = {
			name: "Chrome",
			chrome: e,
			version: n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
		} : o ? T = {
			name: "Android",
			version: w
		} : /safari|applewebkit/i.test(t) ? (T = {
			name: "Safari",
			safari: e
		}, w && (T.version = w)) : i ? (T = {
			name: i == "iphone" ? "iPhone" : i == "ipad" ? "iPad" : "iPod"
		}, w && (T.version = w)) : /googlebot/i.test(t) ? T = {
			name: "Googlebot",
			googlebot: e,
			version: n(/googlebot\/(\d+(\.\d+))/i) || w
		} : T = {
			name: n(/^(.*)\/(.*) /),
			version: r(/^(.*)\/(.*) /)
		}, !T.msedge && /(apple)?webkit/i.test(t) ? (/(apple)?webkit\/537\.36/i.test(t) ? (T.name = T.name || "Blink", T.blink = e) : (T.name = T.name || "Webkit", T.webkit = e), !T.version && w && (T.version = w)) : !T.opera && /gecko\//i.test(t) && (T.name = T.name || "Gecko", T.gecko = e, T.version = T.version || n(/gecko\/(\d+(\.\d+)?)/i)), !T.windowsphone && (o || T.silk) ? (T.android = e, T.osname = "Android") : !T.windowsphone && i ? (T[i] = e, T.ios = e, T.osname = "iOS") : g ? (T.mac = e, T.osname = "macOS") : x ? (T.xbox = e, T.osname = "Xbox") : m ? (T.windows = e, T.osname = "Windows") : y && (T.linux = e, T.osname = "Linux");
		var C = "";
		T.windows ? C = N(n(/Windows ((NT|XP)( \d\d?.\d)?)/i)) : T.windowsphone ? C = n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : T.mac ? (C = n(/Mac OS X (\d+([_\.\s]\d+)*)/i), C = C.replace(/[_\s]/g, ".")) : i ? (C = n(/os (\d+([_\s]\d+)*) like mac os x/i), C = C.replace(/[_\s]/g, ".")) : o ? C = n(/android[ \/-](\d+(\.\d+)*)/i) : T.webos ? C = n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : T.blackberry ? C = n(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : T.bada ? C = n(/bada\/(\d+(\.\d+)*)/i) : T.tizen && (C = n(/tizen[\/\s](\d+(\.\d+)*)/i)), C && (T.osversion = C);
		var k = !T.windows && C.split(".")[0];
		if (E || a || i == "ipad" || o && (k == 3 || k >= 4 && !S) || T.silk) T.tablet = e;
		else if (S || i == "iphone" || i == "ipod" || o || u || T.blackberry || T.webos || T.bada) T.mobile = e;
		return T.msedge || T.msie && T.version >= 10 || T.yandexbrowser && T.version >= 15 || T.vivaldi && T.version >= 1 || T.chrome && T.version >= 20 || T.samsungBrowser && T.version >= 4 || T.firefox && T.version >= 20 || T.safari && T.version >= 6 || T.opera && T.version >= 10 || T.ios && T.osversion && T.osversion.split(".")[0] >= 6 || T.blackberry && T.version >= 10.1 || T.chromium && T.version >= 20 ? T.a = e : T.msie && T.version < 10 || T.chrome && T.version < 20 || T.firefox && T.version < 20 || T.safari && T.version < 6 || T.opera && T.version < 10 || T.ios && T.osversion && T.osversion.split(".")[0] < 6 || T.chromium && T.version < 20 ? T.c = e : T.x = e, T
	}

	function r(e) {
		return e.split(".").length
	}

	function i(e, t) {
		var n = [],
			r;
		if (Array.prototype.map) return Array.prototype.map.call(e, t);
		for (r = 0; r < e.length; r++) n.push(t(e[r]));
		return n
	}

	function s(e) {
		var t = Math.max(r(e[0]), r(e[1])),
			n = i(e, function (e) {
				var n = t - r(e);
				return e += (new Array(n + 1)).join(".0"), i(e.split("."), function (e) {
					return (new Array(20 - e.length)).join("0") + e
				}).reverse()
			});
		while (--t >= 0) {
			if (n[0][t] > n[1][t]) return 1;
			if (n[0][t] !== n[1][t]) return -1;
			if (t === 0) return 0
		}
	}

	function o(e, r, i) {
		var o = n;
		typeof r == "string" && (i = r, r = void 0), r === void 0 && (r = !1), i && (o = t(i));
		var u = "" + o.version;
		for (var a in e)
			if (e.hasOwnProperty(a) && o[a]) {
				if (typeof e[a] != "string") throw new Error("Browser version in the minVersion map should be a string: " + a + ": " + String(e));
				return s([u, e[a]]) < 0
			}
		return r
	}

	function u(e, t, n) {
		return !o(e, t, n)
	}
	var e = !0,
		n = t(typeof navigator != "undefined" ? navigator.userAgent || "" : "");
	return n.test = function (e) {
		for (var t = 0; t < e.length; ++t) {
			var r = e[t];
			if (typeof r == "string" && r in n) return !0
		}
		return !1
	}, n.isUnsupportedBrowser = o, n.compareVersions = s, n.check = u, n._detect = t, n.detect = t, n
})
$(document).ready(function () {
	(function () {
		var taint, d, x, y;
		$(".ripple").click(function (e) {
			if ($(this).find(".taint").length == 0) {
				$(this).prepend("<span class='taint'></span>")
			}
			taint = $(this).find(".taint");
			taint.removeClass("drop");
			if (!taint.height() && !taint.width()) {
				d = Math.max($(this).outerWidth(), $(this).outerHeight());
				taint.css({
					height: d,
					width: d
				});
			}
			x = e.pageX - $(this).offset().left - taint.width() / 2;
			y = e.pageY - $(this).offset().top - taint.height() / 2;
			taint.css({
				top: y + 'px',
				left: x + 'px'
			}).addClass("drop");
		});
	})();
	$('.foo-content, .single .messages').mCustomScrollbar({
		theme: "dark-2"
	});
	var CURRENCIES_DICT = {
		USD: 'дол',
		RUB: 'руб',
		UAH: 'грн'
	};
	var currency_selector = $('#currency-selector-pretty');
	if (currency_selector.length) {
		var currency = currency_selector.children('.active').text();
		$('#cashoutCurrency').val(currency);
		$('#paymentCurrency').val(currency);
	}
	var slick_options = [{
		autoplay: true,
		arrows: false,
		dots: false,
		autoplaySpeed: 5000,
		speed: 2000,
		fade: true
	}, {
		autoplay: true,
		arrows: false,
		dots: false,
		autoplaySpeed: 5000,
		speed: 2000,
		fade: true
	}];
	$('#slick a').each(function () {
		if ($(this).attr('href') === '') $(this).remove();
	});
	$('#slick').slick(slick_options[Math.floor(Math.random() * slick_options.length)]);
	$('.bxslider').bxSlider({
		displaySlideQty: 6,
		moveSlideQty: 6,
		auto: false,
		controls: false,
		autoHover: true,
		pause: 2000,
		randomStart: false,
		pager: true,
		buildPager: function (slideIndex) {
			return slideIndex + 1;
		}
	});
	var ps = $('#selectPS');
	$('#cashoutCurrency').change(function () {
		ps.empty();
		var systems = ps.data('pay-system-' + $(this).val().toLowerCase()).split(',');
		var options = '<option value="">' + _('site.choose_payment_method') + '</option>';
		$.each(systems, function (i, system) {
			options += '<option value="' + system + '">' + _('site.pay_system_' + system) + '</option>';
		});
		ps.append(options);
		ps.trigger('change');
	}).change();
	$.validator.addMethod('regex', function (value, element, regexp) {
		var re = new RegExp(regexp);
		return this.optional(element) || re.test(value);
	}, '');

	function setRange(element, tooltip, min, max, currency) {
		tooltip.text(_('site.tooltip_withdraw', {
			min: min,
			max: max,
			currency: CURRENCIES_DICT[currency]
		}));
		element.attr('min', min);
		element.attr('max', max);
	}
	ps.change(function () {
		var amount = $('#amount');
		var currency = $('#cashoutCurrency').val();
		var tooltip = $('#withdrawTooltip');
		var paylogo = $('.pay_logo');
		if ($(this).val() == '') {
			$("#Visa").hide();
			$("#eWallet").hide();
			tooltip.text('');
			paylogo.html('');
		} else if ($(this).val() == 'card' && currency === 'UAH') {
			$("#Visa").show();
			$("#Visa input").prop('required', true).val('');
			$("#eWallet").hide();
			$("#eWallet > input[name=eWallet]").prop('required', false).val('');
			paylogo.html('<img src="assets/i/visa.png" alt="">');
			setRange(amount, tooltip, 300, 10000, currency);
		} else if ($(this).val() == 'card' && currency === 'RUB') {
			$("#Visa").show();
			$("#Visa input").prop('required', true).val('');
			$("#eWallet").hide();
			$("#eWallet > input[name=eWallet]").prop('required', false).val('');
			paylogo.html('<img src="assets/i/visa.png" alt="">');
			setRange(amount, tooltip, 600, 15000, currency);
		} else {
			$("#Visa").hide();
			$("#Visa input").prop('required', false).val('');
			$("#eWallet").show();
			wallet = $("#eWallet > input[name=eWallet]");
			wallet_label = $("#eWallet > label[for=eWallet]");
			wallet.prop('required', true).val('');
			wallet.removeAttr('minLength');
			wallet.removeAttr('maxLength');
			if ($(this).val() == 'webmoney') {
				if (currency === 'RUB') {
					setRange(amount, tooltip, 600, 60000, currency);
					wallet.attr('placeholder', _('site.enter_x_wallet_number', {
						type: 'R'
					}));
					wallet.attr('regex', '^R[0-9]{12}$');
				} else if (currency === 'UAH') {
					setRange(amount, tooltip, 300, 30000, currency);
					wallet.attr('placeholder', _('site.enter_x_wallet_number', {
						type: 'U'
					}));
					wallet.attr('regex', '^U[0-9]{12}$');
				} else {
					setRange(amount, tooltip, 10, 1000, currency);
					wallet.attr('placeholder', _('site.enter_x_wallet_number', {
						type: 'Z'
					}));
					wallet.attr('regex', '^Z[0-9]{12}$');
				}
				wallet.attr('maxLength', 13);
				wallet.attr('minLength', 13);
				wallet_label.text(_('site.wallet'));
				paylogo.html('<a href="http://webmoney.ru"><img src="assets/i/webmoney.png" alt=""></a>');
			} else if ($(this).val() === 'mts' || $(this).val() === 'beeline' || $(this).val() === 'megafon') {
				wallet.attr('placeholder', _('site.phone_number', {
					codes: '7'
				}));
				wallet.attr('regex', '^7[0-9]{10}$');
				wallet.attr('maxLength', 11);
				wallet.attr('minLength', 11);
				setRange(amount, tooltip, 600, 15000, currency);
				switch ($(this).val()) {
					case 'MTS':
						paylogo.html('<a href="http://mts.ru"><img src="assets/i/mts.png" alt=""></a>');
						break;
					case 'Beeline':
						paylogo.html('<a href="http://beeline.ru"><img src="assets/i/beeline.png" alt=""></a>');
						break;
					case 'Megafon':
						paylogo.html('<a href="http://megafon.ru"><img src="assets/i/megafon.png" alt=""></a>');
						break;
				}
			} else if ($(this).val() === 'yandexmoney') {
				setRange(amount, tooltip, 600, 15000, currency);
				wallet.attr('placeholder', _('site.enter_x_wallet_number', {
					type: ''
				}));
				wallet.attr('regex', '^[0-9]{14,22}$');
				wallet.attr('minLength', 14);
				wallet.attr('maxLength', 22);
				paylogo.html('<a href="http://money.yandex.ru"><img src="assets/i/yandex.png" alt=""></a>');
			} else if ($(this).val() === 'walletone') {
				setRange(amount, tooltip, 600, 15000, currency);
				wallet.attr('placeholder', _('site.enter_x_wallet_number', {
					type: ''
				}));
				wallet.attr('regex', '^[0-9]{12}$');
				wallet.attr('minLength', 12);
				wallet.attr('maxLength', 12);
				paylogo.html('<a href="http://www.walletone.com"><img src="assets/i/walletone.png" alt=""></a>');
				if (currency === 'RUB') {
					setRange(amount, tooltip, 600, 15000, currency);
				} else if (currency === 'UAH') {
					setRange(amount, tooltip, 300, 15000, currency);
				}
			} else if ($(this).val() === 'qiwi') {
				wallet_label.text(_('site.wallet'));
				paylogo.html('<a href="http://qiwi.ru"><img src="assets/i/qiwi.png" alt=""></a>');
				if (currency === 'RUB') {
					wallet.attr('placeholder', _('site.enter_qiwi_wallet_number', {
						codes: '+7'
					}));
					wallet.attr('regex', '^\\+7[0-9]{10}$');
					wallet.attr('maxLength', 12);
					wallet.attr('minLength', 12);
					setRange(amount, tooltip, 600, 15000, currency);
				} else {
					wallet.attr('placeholder', _('site.enter_qiwi_wallet_number', {
						codes: '+7 ' + _('site.common_or') + ' +38'
					}));
					wallet.attr('regex', '^\\+(7|38)[0-9]{10}$');
					wallet.attr('maxLength', 13);
					wallet.attr('minLength', 12);
					setRange(amount, tooltip, 10, 500, currency);
				}
			}
		}
		$('#cashout').height($(this).closest('form').parent().height() + 37);
	});
	if ($("#account-balance-data").length) {
		$(".on_money").click(function (e) {
			if (parseFloat($("#account-balance-data").text()) == 0) {
				var modal = $("#payment").reveal({});
				modal.height(modal.children("div").height() + 37);
				modal.find("form").submit(function () {
					modal.trigger("reveal:close");
				});
				modal.on('reveal:onOpen', function () {
					modal.find('.ripple').removeClass('notransition');
				}).on('reveal:onClose', function () {
					modal.find('.ripple').addClass('notransition');
				});
			}
		});
	}
	initGameLinks();
	var notification = $('#notification');
	notification.height(notification.children('.inner').height() + 37);
	var options = {};
	if (notification.hasClass('jackpot-info')) {
		options = {
			closeonbackgroundclick: false
		};
		notification.on('reveal:onOpen', function () {
			var amount = $(this).find('.amount');
			var value = parseFloat(amount.text());
			amount.text('0.00');
			var od = new Odometer({
				el: amount.get(0),
				value: 0.001,
				format: '( ddd).DD'
			});
			od.update(value);
			var timeout = setTimeout(function () {
				amount.addClass('animated infinite pulse');
			}, 4000);
			$('#get-jackpot, #get-bonus-money').on('click', function () {
				amount.removeClass('animated');
				clearTimeout(timeout);
				od.update(0.001);
				setTimeout(function () {
					notification.find('.ripple').addClass('notransition');
					notification.trigger('reveal:close');
				}, 4000);
			});
		});
	}
	notification.reveal(options);
	var currencySelectorLi = $('#currency-selector-pretty li');
	currencySelectorLi.click(function () {
		if ($(this).hasClass('active')) return;
		currencySelectorLi.removeClass('active');
		var s = $('#currency-selector');
		s.val($(this).text());
		$(this).addClass('active');
		s.trigger('change');
	});
	currencySelectorLi.tooltipster({
		contentAsHTML: true,
		position: 'bottom',
		hideOnClick: true,
		theme: 'tooltipster-shadow',
		functionBefore: function (origin, continueTooltip) {
			if (origin.hasClass('active')) return;
			continueTooltip();
		}
	});
	$('.best_wins .popoverTime').tooltipster({
		contentAsHTML: true,
		position: 'top',
		theme: 'tooltipster-shadow'
	});
	var selCurrencySelect = $('#sel_currency select');
	$('#currency-selector').change(function () {
		var s = $('#account-balance-data');
		s.text(s.data($(this).val().toLowerCase()));
		s = $('#account-balance-in-games-data');
		s.text(s.data($(this).val().toLowerCase()));
		s = $('#account-cashback-data');
		s.text(s.data($(this).val().toLowerCase()));
		s = $('#account-bonus-data');
		s.text(s.data($(this).val().toLowerCase()));
		s = $('#account-bonus-wager-data');
		s.text(s.data($(this).val().toLowerCase()));
		$('.reveal-modal select[name=currency], select[name=default_currency]').val($(this).val()).trigger('change');
		$('input[type=hidden][name=currency]').val($(this).val());
		$.post('?action=set_currency', {
			currency: $(this).val(),
			csrf_hash: CSRFHash
		});
		paySelect(selCurrencySelect.val());
	});
	selCurrencySelect.change(function () {
		$('#paymentTooltip').text(_('site.tooltip_payment', {
			amount: 1,
			currency: CURRENCIES_DICT[$(this).val()]
		}));
		paySelect(selCurrencySelect.val());
	}).change();
	var validationOptions = {
		submitHandler: function (form) {
			$(form).parents('.reveal-modal').trigger('reveal:close');
			form.submit();
		},
		errorPlacement: function (error, element) {}
	}
	$('#paymentForm').validate(validationOptions);
	$('#withdrawForm').validate(validationOptions);
	$('#regForm input[type="text"], #regForm input[type="password"]').tooltipster({
		trigger: 'custom',
		onlyOne: false,
		position: 'right'
	});
	var regForm = $('#regForm');
	var errors = regForm.find('span');
	regForm.validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			login: {
				required: true
			},
			password: {
				minlength: 6
			},
			password2: {
				minlength: 6,
				equalTo: '#passwd'
			}
		},
		messages: {
			email: {
				required: $(errors[0]).text(),
				email: $(errors[1]).text()
			},
			login: $(errors[0]).text(),
			password: {
				minlength: $(errors[2]).text()
			},
			password2: {
				minlength: $(errors[2]).text(),
				equalTo: $(errors[3]).text()
			}
		},
		errorPlacement: function (error, element) {
			$(element).tooltipster('update', $(error).text());
			$(element).tooltipster('show');
		}
	});
	var regPopup = $('#regPopup');
	regPopup.mouseleave(function () {
		$('#regForm input[type="text"], #regForm input[type="password"]').tooltipster('hide');
	});
	regPopup.change(function () {
		$('#regForm input[type="text"], #regForm input[type="password"]').tooltipster('hide');
	});
	paySelect(selCurrencySelect.val());
	$('.payway-select:visible').width($('.payway-select:visible li').length * 100);
	$('.payway-select li').click(function () {
		$('.payway-select li').removeClass('selected');
		$(this).addClass('selected');
		$('#pay-system').val($(this).attr('data-system'));
		var s = $('#selected-ps');
		s.text($(this).find('img').attr('title'));
		s.css('color', '#fff');
		if ($(this).attr('data-system') === 'megafon' || $(this).attr('data-system') === 'mts' || $(this).attr('data-system') === 'beeline') {
			$('#paymentTooltip').text(_('site.tooltip_payment', {
				amount: 10,
				currency: CURRENCIES_DICT[selCurrencySelect.val()]
			}));
		} else {
			$('#paymentTooltip').text(_('site.tooltip_payment', {
				amount: 1,
				currency: CURRENCIES_DICT[selCurrencySelect.val()]
			}));
		}
	});
	arrowLeftClick();
	arrowRightClick();
	$('.nav-slider').bxSlider({
		controls: false,
		pager: false,
		auto: true,
		pause: 10000
	});
	var jackpotsSelector = $('#jackpots');
	jackpotsSelector.width(jackpotsSelector.width());
	$('#jackpot-slider').bxSlider({
		controls: false,
		pager: false,
		auto: true,
		pause: 20000,
		mode: 'fade'
	});
	var jackpots = {};

	function updateJackpot() {
		$.getJSON('?action=get_jackpot', function (jackpot) {
			if (jackpot.status !== 0) return;
			$.map(jackpot.items, function (item) {
				if (item.currency === 'USD') return;
				$.each(item, function (field, value) {
					if (field === 'currency') return;
					var key = field + '_' + item.currency;
					if (!jackpots[key]) {
						var el = $('#' + key + ' > .value');
						jackpots[key] = {
							od: new Odometer({
								el: el.get(0),
								value: value,
								format: '( ddd).DD'
							}),
							parent: el.closest('.jackpot')
						};
					} else {
						if (jackpots[key].parent.is(':visible')) jackpots[key].od.update(value);
					}
				});
			});
		});
	}
	updateJackpot();
	setInterval(updateJackpot, 4000);
	var slots = $('.content-top div.slots');
	if (slots.data('class') === 'active' && window.location.search.indexOf('category=slot') !== -1) {
		slots.addClass('active');
	}
});

function arrowLeftClick() {
	$('.arrow-right').click(function () {
		var offset = 400,
			el = $('.payway-select:visible'),
			left = parseInt(el.css('left')),
			max_left = el.width() - 400,
			new_left = left ? left - offset : -offset;
		new_left = new_left < -max_left ? -max_left : new_left;
		el.animate({
			left: new_left
		}, 400);
	});
}

function arrowRightClick() {
	$('.arrow-left').click(function () {
		var offset = 500,
			el = $('.payway-select:visible'),
			left = parseInt(el.css('left')),
			max_left = 0,
			new_left = left ? left + offset : 0;
		new_left = new_left > 0 ? 0 : new_left;
		el.animate({
			left: new_left
		}, 400);
	});
}

function isMobile() {
	if (window.bowser) {
		return (bowser.tablet || bowser.mobile);
	}
	var a = (navigator.userAgent || navigator.vendor || window.opera);
	if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
		return true;
	}
	return false;
}

function initGameLinks() {
	var defaultRatio = 640 / 480;
	var currentRatio = defaultRatio;

	function getWindowProperties(ratio, type, o_type) {
		var w, h;
		var r = 0;
		var result = {};
		if (type === 0) {
			if (!o_type) {
				w = Math.max(Math.min(screen.width * 0.9, 800), 0);
				h = Math.max(Math.min(screen.height * 0.9, 600), 0);
			} else {
				w = Math.max(screen.width * 0.7, 800);
				h = Math.max(screen.height * 0.7, 600);
			}
			r = w / h;
			if (r < ratio) {
				result.width = w;
				result.height = w / ratio;
			} else {
				result.height = h;
				result.width = h * ratio;
			}
		} else {
			r = screen.height / screen.width;
			if (r >= 0.75) {
				w = screen.width * 0.8;
				h = 3 / 4 * w;
			} else {
				var percent = (screen.width <= 1920) ? 0.70 : 0.60;
				h = percent * screen.height;
				w = h / ((0.75 + r) / 2);
				if (w > 2 * h) w = 2 * h;
			}
			result.width = w;
			result.height = h;
		}
		result.x = (screen.width - result.width) / 2;
		result.y = (screen.height - result.height) / 2;
		return 'left=' + result.x + ',top=' + result.y + ',width=' + result.width + ',height=' + result.height + ',resizable=yes,scrollbars=no,status=no,location=no';
	}
	var gameLinks = $('a[rel="game"],a[target="game"]');
	gameLinks.click(function () {
		if ($(this).hasClass('on_money') && $("#account-balance-data").length && parseFloat($("#account-balance-data").text()) == 0) return false;
		var match = this.href.match(/type=([0-9]{3})/i);
		var type = (match && match.length > 1) ? match[1] | 0 : 0;
		var o_type = 0;
		var framework = '';
		if (type >= 300 && type < 900) {
			o_type = type;
			type = 0;
		}
		if (type === 0) {
			var resolution = $(this).data('resolution');
			if (resolution) {
				currentRatio = eval(resolution.replace('x', '/'));
			} else {
				currentRatio = defaultRatio;
			}
			if (o_type !== 0) {
				framework = !isMobile() ? 'html5' : 'mobile';
			} else {
				if (hasFlash()) {
					if (/(smart|apple|google|hbb|pov|net)[-_]?tv|escape\s\d|kylo\/?\d|lg\sbrowser|roku\/dvp|aquosbrowser/i.test(navigator.userAgent)) {
						framework = 'html5';
					} else {
						framework = 'flash';
					}
				} else {
					framework = 'html5';
				}
			}
		} else {
			currentRatio = screen.width / screen.height;
			framework = !isMobile() ? 'html5' : 'mobile';
		}
		var win = null;
		var currencySelector = $('#currency-selector');
		var selectedCurrency = currencySelector.length ? currencySelector.val() : null;
		if (isMobile()) {
			var href = this.href;
			if (selectedCurrency && href.indexOf('currency') == -1) href += '¤cy=' + selectedCurrency;
			win = window.open(href + '&framework=' + framework);
		} else {
			var href = this.href;
			if (selectedCurrency && href.indexOf('currency') == -1) href += '¤cy=' + selectedCurrency;
			win = window.open(href + '&framework=' + framework, this.title, getWindowProperties(currentRatio, type, o_type));
		}
		if (win) win.focus();
		return false;
	});

	function hasFlash() {
		if (navigator.plugins != null && navigator.plugins.length > 0) {
			return navigator.plugins["Shockwave Flash"] && true;
		}
		if (~navigator.userAgent.toLowerCase().indexOf("webtv")) {
			return true;
		}
		if (~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")) {
			try {
				return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
			} catch (e) {}
		}
		return false;
	}
}