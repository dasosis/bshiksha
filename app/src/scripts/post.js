export await function getResponseData(){
    try {
        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append(
            "description",
            document.getElementById("description").value
        );

        const fileInput = document.getElementById("file");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append("file", file);
        } else {
            console.error("No file selected");
            return;
        }
        formData.append("value", document.getElementById("value").value);

        const response = await fetch("/submit", {
            method: "POST",
            body: formData,
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }
}