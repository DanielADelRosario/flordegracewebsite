$(function(){
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate: '<div class="title">#title#</div>',
        labels: {
            previous: 'Back',
            next: 'Next',
            finish: 'Confirm',
            current: ''
        },
        onInit: function (event, currentIndex) {
            var $actions = $(".actions").find("a");
            $actions.filter('[href="#previous"]').show(); // Ensure Previous button is visible
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            return true; // Allow all transitions
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            var $actions = $(".actions").find("a");
            $actions.filter('[href="#previous"]').show(); // Always show Previous button
    
            if (currentIndex === $("#form-total").find("section").length - 1) {
                $actions.filter('[href="#next"]').hide(); // Hide Next button on the last step
                $actions.filter('[href="#finish"]').show(); // Show Finish button
            } else {
                $actions.filter('[href="#next"]').show(); // Show Next button
                $actions.filter('[href="#finish"]').hide(); // Hide Finish button on intermediate steps
            }
        }
    });
    
        // onStepChanging: function (event, currentIndex, newIndex) { 
        //     var fullname = $('#first_name').val() + ' ' + $('#last_name').val();
        //     var room = $('#room').val();
        //     var day = $('#day').val();
        //     var time = $('#time').val();

        //     $('#fullname-val').text(fullname);
        //     $('#room-val').text(room);
        //     $('#day-val').text(day);
        //     $('#time-val').text(time);

        //     return true;
        // }
    // });
    $("#day").datepicker({
        dateFormat: "MM - DD - yy",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-chevron-down"></i>',
    });
});
