function imgurUpload() {
    let img = ""
    try {
        img = drawio.canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch (e) {
        img = drawio.canvas.toDataURL().split(',')[1];
    }
    $.ajax({
        type: "POST",
        headers: {
            Authorization: "Client-ID 6ed119ffa873364", /* DONT ABUSE ME -.-, please :) */
            Accept: "application/json",
        },
        mimeType: 'multipart/form-data',
        url: "https://api.imgur.com/3/image",
        data: img,
        success: (response) => {
            let jResponse = JSON.parse(response);
            let imgurLink = $("#imgurLink");
            imgurLink.text("Go to Image on Imgur");
            imgurLink.attr('href', jResponse.data.link);
            imgurLink.css("display", "block");
            iqwerty.toast.Toast("Hurrah! You can access your Image in the sidebar");
        },
        error: (err) => {
            iqwerty.toast.Toast("Whoops Something went wrong!");
            console.log(err);
        }
    });
};
