from pathlib import Path
from django.core.management.base import BaseCommand
from home.models import Product, Service


class Command(BaseCommand):
    help = "Seed S K Corporation website data from the supplied company profile."

    def handle(self, *args, **options):
        products = [
            {
                "name": "Turning",
                "category": "Dormer Pramet",
                "description": "Indexable turning tools and inserts for roughing, finishing and profiling.",
                "applications": "Automotive and engineering components; CNC turning centers; general manufacturing and job-shop applications.",
                "image": "partners/dormer-pramet.png", "accent": "#17244a", "order": 1,
            },
            {
                "name": "Indexable Milling",
                "category": "Dormer Pramet",
                "description": "Cutter-and-insert systems for face, shoulder and general milling.",
                "applications": "Modern CNC machining requirements where productivity, repeatability and tool performance are important.",
                "image": "partners/dormer-pramet.png", "accent": "#17244a", "order": 2,
            },
            {
                "name": "Solid Milling",
                "category": "Dormer Pramet",
                "description": "Solid carbide end mills for high-performance milling.",
                "applications": "CNC milling and engineering-component applications.",
                "image": "partners/dormer-pramet.png", "accent": "#17244a", "order": 3,
            },
            {
                "name": "Milling",
                "category": "Palbit",
                "description": "Carbide milling solutions for productive material removal.",
                "applications": "General engineering, automotive, mould & die, railway and aerospace machining applications.",
                "image": "partners/palbit.png", "accent": "#ef233c", "order": 4,
            },
            {
                "name": "Turning",
                "category": "Palbit",
                "description": "Turning tools and inserts for industrial machining.",
                "applications": "Industrial machining where cutting performance and application-specific tooling matter.",
                "image": "partners/palbit.png", "accent": "#ef233c", "order": 5,
            },
            {
                "name": "Threading",
                "category": "Palbit",
                "description": "Internal and external threading solutions.",
                "applications": "General engineering and component manufacturing.",
                "image": "partners/palbit.png", "accent": "#ef233c", "order": 6,
            },
            {
                "name": "PCBN & PCD Inserts",
                "category": "IL Precision Technology",
                "description": "ISO and tailor-made PCBN and PCD inserts for precision component manufacturing.",
                "applications": "Hard machining, wear resistance, surface finish, non-ferrous materials and tooling cost-per-component applications.",
                "image": "partners/il-precision-technology.png", "accent": "#1c2b52", "order": 7,
            },
            {
                "name": "Metalworking Fluids",
                "category": "Tectyl Oil’s Chemicals",
                "description": "Water-soluble and neat cutting oils, rust preventives, cleaners, forming oils, heat-treatment oils, hydraulic/industrial oils and grease/coating wax.",
                "applications": "CNC machining, component manufacturing, metal forming, heat treatment, industrial maintenance and metal protection.",
                "image": "partners/tectyl-oils-chemicals.png", "accent": "#2e6f40", "order": 8,
            },
            {
                "name": "Engineering Tooling",
                "category": "Birla Precision Technologies",
                "description": "HSS and carbide cutting tools, machining-center tooling, tool holders, work holding and production-support products.",
                "applications": "VMC/HMC machining centers, CNC lathes, high-speed machining and applications where rigidity, concentricity, repeatability and setup reduction matter.",
                "image": "partners/birla-precision-technologies.png", "accent": "#17244a", "order": 9,
            },
            {
                "name": "CNC Tool Holders",
                "category": "Accurate Tools — Rajkot",
                "description": "CNC tool holders, shrink-fit holders and turning tool holders.",
                "applications": "Engineering component manufacturers, CNC turning, VMC tooling, tool-room operations and job shops.",
                "image": "partners/accurate-tools-rajkot.png", "accent": "#111827", "order": 10,
            },
            {
                "name": "MRO Solutions",
                "category": "Stanvac Chemicals",
                "description": "Industrial maintenance portfolio covering lubrication, rust/corrosion protection, mechanical repair, electrical maintenance, cable protection, pump maintenance and motor-maintenance solutions.",
                "applications": "Manufacturing plants, steel and mining, chemical and fertilizer plants, power, water/ETP, pumps, motors, machinery and general MRO.",
                "image": "partners/stanvac-chemicals.png", "accent": "#334155", "order": 11,
            },
            {
                "name": "Bimetal & Carbide Band Saw Blades",
                "category": "Bichamp Cutting Technology",
                "description": "Industrial sawing technology with blade-selection and technical guidance for industrial applications.",
                "applications": "Steel service centers, saw shops, automotive and machinery component manufacturers, rail-related manufacturing and industrial metal cutting.",
                "image": "partners/bichamp-cutting-technology.png", "accent": "#17244a", "order": 12,
            },
        ]
        Product.objects.all().delete()
        for item in products:
            Product.objects.create(**item)

        services = [
            ("Application Support", "Identify the machining or maintenance requirement, review application conditions and coordinate product selection and quotation/supply.", "bi-headset"),
            ("Technical Product Selection", "Match product selection to material, operation and machining conditions for a more structured application approach.", "bi-sliders2-vertical"),
            ("MRO & Maintenance Solutions", "Support lubrication, rust/corrosion protection, mechanical repair, electrical maintenance and related industrial MRO requirements.", "bi-gear-wide-connected"),
            ("Industrial Sawing Support", "Support blade selection and application-focused guidance for industrial metal cutting and sawing requirements.", "bi-scissors"),
            ("Tooling Systems", "Provide cutting-tool and tooling-system options spanning turning, milling, drilling, threading, tool holding and work holding.", "bi-tools"),
        ]
        Service.objects.all().delete()
        for i, (title, description, icon) in enumerate(services, 1):
            Service.objects.create(title=title, description=description, icon=icon, order=i)

        self.stdout.write(self.style.SUCCESS("S K Corporation website data seeded successfully."))
