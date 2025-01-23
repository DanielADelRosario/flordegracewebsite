const my_handlers = {
    // Fill provinces based on region
    fill_provinces: function () {
        console.log("fill_provinces triggered");

        const region_code = $(this).val();
        const region_text = $(this).find("option:selected").text();

        console.log("Selected Region:", { region_code, region_text });

        $('#region_text').val(region_text || '');

        if (!region_code) {
            console.warn("No region selected.");
            return;
        }

        resetDropdown($('#province'), 'Choose State/Province');
        resetDropdown($('#city'), 'Choose City/Municipality');
        resetDropdown($('#barangay'), 'Choose Barangay');

        const url = '/static/js/ph-json/province.json';
        $.getJSON(url)
            .done(function (data) {
                const filteredData = data
                    .filter(item => item.region_code == region_code)
                    .sort((a, b) => a.province_name.localeCompare(b.province_name));

                console.log("Filtered Province Data:", filteredData);

                $.each(filteredData, function (_, entry) {
                    $('#province').append(
                        $('<option></option>')
                            .attr('value', entry.province_code)
                            .text(entry.province_name)
                    );
                });

                $('#province').prop('disabled', false);
            })
            .fail(function (_, textStatus, error) {
                console.error("Error loading provinces:", textStatus, error);
                alert("Failed to load provinces. Please try again.");
            });
    },

    // Fill cities based on province
    fill_cities: function () {
        const province_code = $(this).val();
        if (!province_code) {
            console.warn("No province selected.");
            return;
        }

        const province_text = $(this).find("option:selected").text();
        $('#province-text').val(province_text);

        resetDropdown($('#city'), 'Choose City/Municipality');
        resetDropdown($('#barangay'), 'Choose Barangay');

        const url = '/static/js/ph-json/city.json';
        $.getJSON(url)
            .done(function (data) {
                const result = data.filter(item => item.province_code == province_code);
                result.sort((a, b) => a.city_name.localeCompare(b.city_name));
                $.each(result, function (_, entry) {
                    $('#city').append(
                        $('<option></option>').attr('value', entry.city_code).text(entry.city_name)
                    );
                });

                $('#city').prop('disabled', false);
            })
            .fail(function (_, textStatus, error) {
                console.error('Error loading cities:', textStatus, error);
                alert('Failed to load cities. Please try again.');
            });
    },

    // Fill barangays based on city
    fill_barangays: function () {
        const city_code = $(this).val();
        if (!city_code) {
            console.warn("No city selected.");
            return;
        }

        const city_text = $(this).find("option:selected").text();
        $('#city-text').val(city_text);

        resetDropdown($('#barangay'), 'Choose Barangay');

        const url = '/static/js/ph-json/barangay.json';
        $.getJSON(url)
            .done(function (data) {
                const result = data.filter(item => item.city_code == city_code);
                result.sort((a, b) => a.brgy_name.localeCompare(b.brgy_name));
                $.each(result, function (_, entry) {
                    $('#barangay')
                        .append(
                            $('<option></option>').attr('value', entry.brgy_code).text(entry.brgy_name)
                        );
                });

                $('#barangay').prop('disabled', false);
            })
            .fail(function (_, textStatus, error) {
                console.error('Error loading barangays:', textStatus, error);
                alert('Failed to load barangays. Please try again.');
            });
    },

    // Handle barangay selection
    onchange_barangay: function () {
        const barangay_text = $(this).find("option:selected").text();
        $('#barangay-text').val(barangay_text);
    }
};

$(document).ready(function () {
    console.log("Document Ready!");

    // Event bindings
    $(document).on('change', '#region', my_handlers.fill_provinces);
    $(document).on('change', '#province', my_handlers.fill_cities);
    $(document).on('change', '#city', my_handlers.fill_barangays);
    $(document).on('change', '#barangay', my_handlers.onchange_barangay);

    const url = '/static/js/ph-json/region.json';

    // Populate regions dynamically
    $.getJSON(url)
        .done(function (data) {
            console.log("Region data loaded:", data);

            const dropdown = $('#region');
            dropdown.empty();
            dropdown.append('<option value="" disabled selected>Choose Region</option>');

            $('#province').prop('disabled', true);
            $('#city').prop('disabled', true);
            $('#barangay').prop('disabled', true);

            $.each(data, function (_, entry) {
                dropdown.append(
                    $('<option></option>')
                        .attr('value', entry.region_code)
                        .text(entry.region_name)
                );
            });

        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("Error loading JSON:", textStatus, error);
        });
});

// Helper to reset dropdown
function resetDropdown(dropdown, placeholder) {
    dropdown.empty();
    dropdown.append(`<option value="" disabled selected>${placeholder}</option>`);
    dropdown.prop('disabled', false);
}
