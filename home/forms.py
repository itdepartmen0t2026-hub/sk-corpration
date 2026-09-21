from django import forms
from .models import ContactEnquiry


class ContactEnquiryForm(forms.ModelForm):
    class Meta:
        model = ContactEnquiry
        fields = ["name", "company", "email", "phone", "subject", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Your name"}),
            "company": forms.TextInput(attrs={"class": "form-control", "placeholder": "Company name"}),
            "email": forms.EmailInput(attrs={"class": "form-control", "placeholder": "name@example.com"}),
            "phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+91 ..."}),
            "subject": forms.TextInput(attrs={"class": "form-control", "placeholder": "How can we help?"}),
            "message": forms.Textarea(attrs={"class": "form-control", "placeholder": "Tell us about your requirement", "rows": 6}),
        }
