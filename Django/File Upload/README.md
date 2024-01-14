#   Django - File Upload


#### app/urls.py

path("upload", views.document_upload_view, name="document_upload_url"),


#### app/views.py


@login_required
def document_upload_view(request):
    if request.method == 'POST' and request.FILES.get('file'):
        myFile = request.FILES.get('file')
        uploaded_document = Document.objects.create(
            document=myFile, 
            name=myFile.name
        )
        uploaded_document.save()
    template_name = "master_app/document_upload.html"
    context = {

    }
    return render(request, template_name, context)


#### templates

{% extends 'master_app/base.html' %}
{% load static %}


{% block title %} Upload File {% endblock %}


{% block styles %}


<link rel="stylesheet" href="{% static 'assets/css/custom.css' %}">
<link rel="stylesheet" href="{% static 'assets/vendor/dropzone/dropzone.css' %}">
    <script src="{% static 'assets/vendor/dropzone/dropzone.js' %}"></script>

    

    

{% endblock %}


{% block content %}



<main>
    

    <div class="container ">
      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row">
            <div class="col-6 mx-auto my-5 py-3">
                
                  <form enctype='multipart/form-data' action="{% url 'document_upload_url' %}" method='POST' class="dropzone dz " id="my-dropzone" >
                    {% csrf_token %}
                    <div class="fallback ">
                      <input name="myfile" type="file" multiple />
                    </div>
                </form>
                

                <ul id="upload-filelist" class="completed mx-0 d-none">
                    
                    <li class="file total "  data-filename="">
                        <span class="file-name">Done!</span>
                        
                        <span class="file-size"></span>
                    </li>
                </ul>

            </div>
        </div>
        </div>
      </section>
        
    </div>

  </main><!-- End #main -->

{% endblock %}



{% block scripts %}

<script src="{% static 'assets/js/jquery-3.5.1.min.js' %}"></script>
<script src="{% static 'assets/js/custom.js' %}"></script>

{% endblock %}



#### custom css


body {
    background-color: #f2f2f2 !important;
    color: #23272A !important;
}


.dz {
    border: dashed !important;
    background-color: #ccc !important;
    border-radius: 10px !important;
}

.dz:hover {
    background-color: aliceblue !important;
}


.completed#upload-filelist {
    background: rgb(245, 245, 245);
    padding: 15px;
    margin: 15px;
    border: 2px solid #c5dcf5;
}
#upload-filelist {
    list-style-type: none;
    margin: 20px 50px;
    padding: 0;
    text-align: left;
}

#upload-filelist>li {
    margin-top: 5px;
    overflow: hidden;
}

.file-name {
    float: left;
    /* overflow: hidden; */
    max-width: 70%;
    /* text-overflow: clip; */
    /* white-space: nowrap; */
}

.completed .file-url {
    display: block;
}

.file-size, .file-url {
    display: inline-block;
    float: right;
    font-size: .9em;
    margin-left: 8px;
    color: #2F2F2F;
    vertical-align: middle;
}

.file-url a {
    color: #f5f5f5;
    font-size: 14px;
    background: #333544;
    padding: 5px 10px 5px 10px;
    line-height: 26px;
}

.jumbosonic a {
    color: #23272A;
    text-decoration: none;
    transition: color .15s;
}

#upload-filelist>li.total {
    border-top: 1px solid rgba(0,0,0,0.4);
    font-weight: 700;
    padding-top: 5px;
}
#upload-filelist>li {
    margin-top: 5px;
    overflow: hidden;
}


select {
    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.custom-select {
    display: inline-block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    vertical-align: middle;

    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}



#### custom js

var totalSizeLimit = 100*1024*1024;
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1000
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
Dropzone.autoDiscover=false;
const myDropzone= new Dropzone('#my-dropzone',{
    maxFilesize: 50*1024*1024,
    acceptedFiles: '*',
})
// myDropzone.on('sending', function(file, xhr, formData){
//     formData.append('expire', $("select#expsel").val());
//     formData.append('autodestroy', $("#autodestroy").prop("checked"));
//     formData.append('randomizefn', $("#randomizefn").prop("checked"));
//     formData.append('shorturl', $("#shorturl").prop("checked"));
// });
myDropzone.on("uploadprogress", function(file, progress, bytesSent) {
    var alreadyUploadedTotalSize = getTotalPreviousUploadedFilesSize();
    if((alreadyUploadedTotalSize + bytesSent) > totalSizeLimit){
        this.disable();
        alert("Uploading Exceeding from Limit.")
    }
});
function getTotalPreviousUploadedFilesSize(){
var totalSize = 0;
myDropzone.getFilesWithStatus(Dropzone.SUCCESS).forEach(function(file){
    totalSize = totalSize + file.size;
});
    return totalSize;
}
myDropzone.on("success", function(file, responseText) {
    let data = JSON.parse(responseText.document)
    $("ul#upload-filelist").prepend(
        `
        <li class="file " data-filename="/files/details/${data[0]?.pk}">
            <span class="file-name">${file.name}</span>
            <div class="file-progress progress-outer">
                <div class="progress-inner" style="width: 100%;"></div>
            </div>

            <span class="file-url">
                <span>
                    <a href="/files/details/${data[0]?.pk}" target="_BLANK">Details</a>
                </span>
            </span>
        </li>
        `
    );
    $("ul#upload-filelist").removeClass("d-none")
    $("span.file-size").html(formatBytes(getTotalPreviousUploadedFilesSize()))
});