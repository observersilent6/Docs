#   django-compressor


Ref : https://django-compressor.readthedocs.io/en/latest/usage.html#examples


{% load compress %}
{% compress <js/css> [<file/inline/preload> [block_name]] %}
<html of inline or linked JS/CSS>
{% endcompress %}


{% compress js %}
<script src="/static/js/one.js" async></script>
{% endcompress %}
{% compress js %}
<script src="/static/js/one.js" defer></script>
{% endcompress %}