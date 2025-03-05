$(function (){
    //nav hidden/show
    $(window).scroll(function (){
        let scrollY = $(document).scrollTop();
        // console.log(scrollY);
        if(scrollY>=230){
            $('#nav').slideDown(500);
        }else{
            $('#nav').slideUp(500);
        }
    });

    //main-left move
    const component = $('#main .main-center .main-left');
    const offset = component.offset();

    // 获取元素原来的 y 位置
    const originalY = offset.top;
    $(window).scroll(function (){
        let scrollY = $(document).scrollTop();
        if(scrollY>=210){
            $('#main .main-center .main-left').css('top', scrollY+57);
        }
        else if(scrollY<210){
            $('#main .main-center .main-left').css('top', originalY);
        }

    });
    //hot-search move
    const component2 = $('.main-right-hotsearch');
    const offset2 = component2.offset();

    // 获取元素原来的 y 位置
    const originalY2 = offset2.top;
    $(window).scroll(function (){
        let scrollY2 = $(document).scrollTop();
        // 计算元素新的 top 值
        if(scrollY2>=402){
            $('.main-right-hotsearch').css('top', scrollY2+50);
        }
        else if(scrollY2<402){
            $('.main-right-hotsearch').css('top', originalY2);
        }

    });
    // get blog context
    $.ajax({
        url: "https://apifoxmock.com/m1/5909217-5596167-default/blog",
        type: "get",
        success:function (res){
            // console.log(res);
            loadArticle();
            window.addEventListener('scroll',function (){
                var timer;
                var starTime = new Date();
                return function (){
                    var curTime = new Date();
                    if(curTime- starTime>=2000){
                        timer = setTimeout(function (){
                            loadArticle();
                        },500);
                        starTime = curTime;
                    }
                }
            }());
            function loadArticle(){
                let artcleArr = res.blog;
                let fiveArr = artcleArr.splice(0,5);

                for(let i = 0;i<fiveArr.length;i++){
                    const blog = res.blog[i];
                    let picturenum = Math.floor(Math.random() * 3) + 1;
                    let imgString = '';
                    for (let j = 0; j < picturenum; j++) {
                        imgString += `<img src="${blog[`img${j + 1}`]}">`;
                    }
                    const articleElement = `
                <div class="main-bottom">
                    <div class="main-bottom-blog">
                        <div class="title">
                            <div class="title-img">
                                <img src="${blog.headimg}">
                                <span class="iconfont icon-renzheng"></span>
                            </div>
                            <div class="title-name">
                                <div class="title-name-top">
                                    <span>${blog.username}</span>
                                    <span class="iconfont icon-huangguan"></span>
                                    <span class="iconfont icon-huangguan"></span>
                                    <span class="iconfont icon-huangguan"></span>
                                </div>
                                <div class="title-name-hour">${blog.time}</div>
                                <div class="title-name-show">${blog.address}</div>
                            </div>
                            <div class="title-name-focus">
                                <span class="iconfont icon-jiahao1" id="follow${i+1} "style="z-index: 2"></span>
                                Follow
                            </div>
                        </div>
                        <div class="blog">
                            <div>${blog.article}</div>
                            ${imgString}
                        </div>
                        <div class="share">
                            <div class="iconfont icon-fenxiang_2">${blog.transfer}</div>
                            <div class="iconfont icon-pinglun">${blog.comment}</div>
                            <div class="iconfont icon-dianzan dianzan" id="like${i+1}">${blog.like}</div>
                        </div>
                    </div>
                </div>
            `;
                    $('.main-bottom-template').append(articleElement);
                }
            }
        }
    });
    //tiny search
    $('.nav-center-search input').focus(function (){
        $('.nav-center-search .content').show();
        $('.nav-center-search .active').css('color','#ff8200')
    })

    $('.nav-center-search input').blur(function (){
        $('.nav-center-search .content').hide();
        $('.nav-center-search .active').css('color','#000')
    })

    //day/night mode
    $('.nav-center-four .nav-center-sun').click(function (){
        $('.nav-center-four .nav-center-sun').toggleClass('icon-yueliang');
        const $html = $('html');
        if ($html.attr('data-theme') === 'dark') {
            // 如果是黑夜模式，切换到日间模式
            $html.removeAttr('data-theme');
            $('.main-right-top').css('background-image','url("images/bg.jpg")')
            $('#nav .nav-center .nav-center-logo img').css('visibility', 'visible')
        } else {
            // 如果是日间模式，切换到黑夜模式
            $html.attr('data-theme', 'dark');
            $('.main-right-top').css('background-image','url("images/bg_night.jpg")')
            $('#nav .nav-center .nav-center-logo img').css('visibility','hidden')
        }
    })
    fetchHotSearchData();
    //HotSearch Context
    function fetchHotSearchData() {
        $.ajax({

            url: "https://apifoxmock.com/m1/5909217-5596167-default/hotsearch",
            type: "get",
            success: function (res) {
                // console.log(res.data.hotsearch);


                const hotsearchArray = [];
                $.each(res.data.hotsearch, function (key, item) {
                    hotsearchArray.push({key: key, value: item});
                });

                hotsearchArray.sort(function (a, b) {
                    return b.value.hotindex - a.value.hotindex;
                });
                $.each(hotsearchArray, function (index, entry) {
                    const key = entry.key;
                    const item = entry.value;
                    // console.log(hotsearchArray)
                    // console.log(`Key: ${key}`);
                    // console.log(`Title: ${item.title}`);
                    // console.log(`Hot Index: ${item.hotindex}`);
                    // console.log(`Icon: ${item.icon}`);
                    // console.log('----------------------');
                });
                $('#main .main-right-hotsearch .hot-top .hot').remove();
                for (let i = 0; i < hotsearchArray.length; i++) {
                    rankstyle='';
                    hotIndexStyle='';
                    if(i<3){
                        rankstyle = 'font-size: 18px;\n' +
                            '        font-style: italic;\n' +
                            `        color: rgb(255, 60+${i*20}, 0);`;
                    }
                    if(hotsearchArray[i].value.icon.charAt(0)=='H'){
                        hotIndexStyle='background-color: #ff6b8a';
                    }
                    else if(hotsearchArray[i].value.icon.charAt(0)=='T'){
                        hotIndexStyle='background-color: #fec942'
                    }
                    else if(hotsearchArray[i].value.icon.charAt(0)=='N'){
                        hotIndexStyle='background-color: #50b9ff'
                    }
                    let oDiv = `
                            <div class="hot" id="top${i+1}">
                                <div style="${rankstyle}">${i+1}</div>
                                <div title="${hotsearchArray[i].value.title}">${hotsearchArray[i].value.title}</div>                
                                <div>${hotsearchArray[i].value.hotindex.toFixed(1)}</div>               
                                <div title="${hotsearchArray[i].value.icon}" style="${hotIndexStyle}">${hotsearchArray[i].value.icon}</div>
                            </div>    
                            `;
                    $('#main .main-right-hotsearch .hot-top').append(oDiv);
                }


            }
        });

    }

    //reload
    let refresh = $('#main .main-right-hotsearch .refresh').click(
        function(){
            fetchHotSearchData();
        }
    );

    //like
    $(document).ready(function (){
        $('.main-bottom-template').on('click','.icon-dianzan',function (){
            var $this = $(this);
            if (!$this.data('isClicked')) {
                // 第一次点击
                var initialColor = '#626262';
                var initialText = $this.text();
                $this.data('initialColor', initialColor);
                $this.data('initialText', initialText);
                $this.css('color', '#ff8200');
                var currentText = parseInt($this.text());
                $this.text(currentText + 1);
                $this.data('isClicked', true);
            } else {
                // 第二次点击
                var initialColor = $this.data('initialColor');
                var initialText = $this.data('initialText');
                $this.css('color', initialColor);
                $this.text(initialText);
                $this.data('isClicked', false);
            }
        })
    })

    //Follow
    $(document).ready(function (event){
        $('.main-bottom-template').on('click','.title-name-focus',function (){
            var $this = $(this);
            if (!$this.data('isClicked')) {
                // 第一次点击
                var initialText = $this.text();
                $this.data('initialText', initialText);
                $this.text('Followed');
                $this.addClass('clicked');
                $this.data('isClicked', true);
            } else {
                // 第二次点击
                var initialText = $this.data('initialText');
                $this.text(initialText);
                $this.removeClass('clicked');
                $this.data('isClicked', false);
            }
        })
    });





})