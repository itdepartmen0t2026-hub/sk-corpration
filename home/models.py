from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=160)
    category = models.CharField(max_length=160)
    url = models.CharField(max_length=160,null=True, blank=True)
    description = models.TextField()
    applications = models.TextField(blank=True)
    image = models.FileField(upload_to="products/", blank=True, null=True)
    accent = models.CharField(max_length=20, default="#17244a")
    is_featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Service(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField()
    icon = models.CharField(max_length=50, default="bi-stars")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class ContactEnquiry(models.Model):
    name = models.CharField(max_length=120)
    company = models.CharField(max_length=160, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=180, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject or 'Enquiry'}"
