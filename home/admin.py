from django.contrib import admin
from .models import ContactEnquiry, Product, Service

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_featured", "order")
    list_filter = ("category", "is_featured")
    search_fields = ("name", "category", "description")
    ordering = ("order", "name")

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    search_fields = ("title", "description")

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "email", "subject", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "company", "email", "phone", "subject", "message")
    readonly_fields = ("created_at",)
