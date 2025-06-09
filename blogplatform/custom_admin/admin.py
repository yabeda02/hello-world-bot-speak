from django.contrib import admin
from blog.models import Post, Comment
from users.models import UserProfile

admin.site.site_header = "Blog Platform Admin"
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(UserProfile)
