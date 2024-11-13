
//  ### select ###

$(document).ready(function () {
    $('.header__select-options').hide();

    $('.header__select-trigger').on('click', function (e) {
        e.stopPropagation();

        const $parent = $(this).closest('.header__select');
        const $options = $parent.find('.header__select-options');

      
        $('.header__select-options').not($options).slideUp(300);
        $('.header__select').not($parent).removeClass('open');

        if ($parent.hasClass('open')) {
            $options.slideUp(300);
            $parent.removeClass('open');
        } else {
            $options.slideDown(300);
            $parent.addClass('open');
        }

        const $arrow = $parent.find('.arrow svg');
        $arrow.css('transform', $parent.hasClass('open') ? 'rotate(180deg)' : 'rotate(0deg)');
        $arrow.css('transition', 'transform 0.3s ease');
    });

   
    $('.header__select-option').on('click', function (e) {
        e.stopPropagation();

        const value = $(this).data('value');
        const text = $(this).text();
        const $parent = $(this).closest('.header__select');

       
        $parent.find('.header__select-trigger span').text(text);
        $parent.removeClass('open').find('.header__select-options').slideUp(300);

        $parent.find('.arrow svg').css('transform', 'rotate(0deg)');

       
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

      
        let $input = $parent.find('input');
        if ($input.length === 0) {
            $parent.append(`<input type="hidden" name="header__select" value="${value}">`);
        } else {
            $input.val(value);
        }
    });

   
    $(document).on('click', function () {
        $('.header__select-options').slideUp(300);
        $('.header__select').removeClass('open');
        $('.arrow svg').css('transform', 'rotate(0deg)');
    });
});

// Экран

$(document).ready(function () {
    function setVH() {
        
        let vh = window.innerHeight * 0.01;

        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();

    $(window).on('resize', setVH);
});


// Модалка
$(document).ready(function () {
    const $modal = $('.modal');
    const $modalClose = $('.modal__close');
    const $openModal = $('.open-modal');
    const $inputs = $('.modal__form-inner input');

   
    $('input[type="text"]').eq(1).mask("+7 (999) 999-99-99");

   
    $openModal.on('click', function (e) {
        e.preventDefault();
        $modal.addClass('active');
    });

    
    $modalClose.on('click', function () {
        $modal.removeClass('active');
    });

   
    $(document).on('keydown', function (e) {
        if (e.key === "Escape") {
            $modal.removeClass('active');
        }
    });

 
    
    $('.modal__form-btn').on('click', function (e) {
        e.preventDefault();
        const formData = {
            name: $('input').eq(0).val().trim(),
            phone: $('input').eq(1).val().trim(),
            email: $('input').eq(2).val().trim(),
        };
        console.log(formData);
    });
});


$(document).ready(function () {
    const $inputs = $('.modal__form-inner input');

    $inputs.each(function () {
        const $input = $(this);
        const $label = $input.siblings('label');

        $input.on('focus', function () {
            $label.addClass('active'); 
        });

       
        $input.on('blur', function () {
            if ($input.val().trim() === '') {
                $label.removeClass('active');
            }
        });

       
        if ($input.val().trim() !== '') {
            $label.addClass('active');
        }
    });
});

$(document).ready(function () {
    const $videoModal = $('.video-modal');
    const $videoClose = $('.video-modal__close');
    const $videoTrigger = $('.video-open');
    const $video = $videoModal.find('video');


    $videoTrigger.on('click', function () {
        $videoModal.addClass('active');
        $video[0].play(); 
    });

    
    $videoClose.on('click', function () {
        $videoModal.removeClass('active');
        $video[0].pause(); 
        $video[0].currentTime = 0; 
    });

   
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $videoModal.removeClass('active');
            $video[0].pause();
            $video[0].currentTime = 0;
        }
    });
});


