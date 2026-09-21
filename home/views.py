from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import ContactEnquiryForm
from .models import ContactEnquiry, Product, Service


def home(request):
    # Featured products: Dormer Pramet products ko first order mein rakhein
    featured = (
        Product.objects
        .filter(is_featured=True)
        .order_by("category", "name")[:6]
    )

    # QuerySet ko list bana kar 3 cards ke slide groups banayein
    featured_list = list(featured)

    featured_slides = [
        featured_list[index:index + 3]
        for index in range(0, len(featured_list), 3)
    ]

    services = Service.objects.all()[:4]

    return render(
        request,
        "home/home.html",
        {
            "featured": featured,
            "featured_slides": featured_slides,
            "services": services,
        },
    )



# def home(request):
#     featured = Product.objects.filter(featured=True)

#     featured_list = list(featured)

#     # Har carousel screen par 3 product cards dikhane ke liye
#     featured_slides = [
#         featured_list[index:index + 3]
#         for index in range(0, len(featured_list), 3)
#     ]

#     return render(request, "home/index.html", {
#         "featured": featured,
#         "featured_slides": featured_slides,
#     })

def about(request):
    return render(request, "home/about.html")


def products(request):
    product_qs = Product.objects.all()
    categories = []
    seen = set()
    for p in product_qs:
        if p.category not in seen:
            categories.append(p.category)
            seen.add(p.category)
    return render(request, "home/products.html", {"products": product_qs, "categories": categories})


def services(request):
    return render(request, "home/services.html", {"services": Service.objects.all()})


def contact(request):
    if request.method == "POST":
        form = ContactEnquiryForm(request.POST)
        if form.is_valid():
            enquiry = form.save()
            messages.success(request, "Thank you. Your enquiry has been received.")
            return redirect("home:contact")
    else:
        form = ContactEnquiryForm()
    return render(request, "home/contact.html", {"form": form})
