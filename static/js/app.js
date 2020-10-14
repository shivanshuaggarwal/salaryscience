$(document).ready(function() {

    $("#btn_predict").click(function() {
        if ($('#input_location').val()=='')
        {
            alert("Location cannot be empty");
            return
        }
        $.ajax({
            url: '/predict',
            method: 'post',
            data: JSON.stringify({ "selectedYear": $("#select_year option:selected").val(),"selectedMonth": $("#select_month option:selected").val(),"selectedSkill": $("#select_skill option:selected").val(),"location": $('#input_location').val()}),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                $(".result").hide();
            },
            complete: function() {
                // ... your finalization code here (hide loader) ...
                $(".loading").hide();
            },
            success: function(data) {
                // alert(data.status)
                // alert(data.predicted_ctc)
                $('.result').html("Estimated CTC= Rs. "+data.predicted_ctc+" Lakhs");
                
                $(".result").show();
				
            },

            error: function() {
                console.log("Failed");
            }
        });

    });

});