"""Curated knowledge base for the AI Engine.

This module encodes the domain knowledge that powers skill-gap analysis,
roadmaps, and resume skill coverage. In a production system this could be
moved to the database or sourced from a live job-market API; keeping it here
makes the engine deterministic, explainable, and unit-testable.
"""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class CareerProfile:
    track: str
    label: str
    core_skills: list[str]
    tools: list[str]
    certifications: list[str]
    project_ideas: list[str]
    keywords: list[str] = field(default_factory=list)


CAREER_PROFILES: dict[str, CareerProfile] = {
    "SOFTWARE_ENGINEERING": CareerProfile(
        track="SOFTWARE_ENGINEERING",
        label="Software Engineering",
        core_skills=[
            "data structures", "algorithms", "object-oriented programming",
            "system design", "rest api", "git", "testing", "sql",
            "javascript", "python", "react", "node.js", "ci/cd",
        ],
        tools=["Docker", "GitHub Actions", "PostgreSQL", "Redis", "Kubernetes"],
        certifications=[
            "AWS Certified Developer – Associate",
            "Oracle Certified Professional: Java SE",
            "Meta Back-End Developer",
        ],
        project_ideas=[
            "Full-stack task management app with auth",
            "REST API with rate limiting and caching",
            "Real-time chat application using WebSockets",
        ],
        keywords=["api", "backend", "frontend", "deploy", "scalable", "microservice"],
    ),
    "ARTIFICIAL_INTELLIGENCE": CareerProfile(
        track="ARTIFICIAL_INTELLIGENCE",
        label="Artificial Intelligence",
        core_skills=[
            "python", "machine learning", "deep learning", "neural networks",
            "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy",
            "nlp", "computer vision", "statistics", "linear algebra",
        ],
        tools=["Jupyter", "Hugging Face", "Weights & Biases", "CUDA", "MLflow"],
        certifications=[
            "TensorFlow Developer Certificate",
            "AWS Certified Machine Learning – Specialty",
            "DeepLearning.AI Specialization",
        ],
        project_ideas=[
            "Image classifier with transfer learning",
            "Sentiment analysis NLP pipeline",
            "Recommendation system with collaborative filtering",
        ],
        keywords=["model", "training", "dataset", "accuracy", "inference", "embedding"],
    ),
    "CLOUD_COMPUTING": CareerProfile(
        track="CLOUD_COMPUTING",
        label="Cloud Computing",
        core_skills=[
            "aws", "azure", "gcp", "linux", "networking", "terraform",
            "docker", "kubernetes", "ci/cd", "iam", "load balancing",
            "serverless", "monitoring",
        ],
        tools=["Terraform", "Ansible", "Prometheus", "Grafana", "Helm"],
        certifications=[
            "AWS Certified Solutions Architect – Associate",
            "Microsoft Certified: Azure Administrator",
            "Certified Kubernetes Administrator (CKA)",
        ],
        project_ideas=[
            "Infrastructure-as-Code deployment with Terraform",
            "Auto-scaling web app on Kubernetes",
            "Serverless image-processing pipeline",
        ],
        keywords=["cloud", "infrastructure", "scaling", "availability", "vpc"],
    ),
    "IT_INFRASTRUCTURE": CareerProfile(
        track="IT_INFRASTRUCTURE",
        label="IT Infrastructure",
        core_skills=[
            "linux", "windows server", "networking", "tcp/ip", "dns",
            "active directory", "virtualization", "vmware", "bash",
            "powershell", "monitoring", "backup", "security",
        ],
        tools=["VMware", "Hyper-V", "Nagios", "Zabbix", "Ansible"],
        certifications=[
            "CompTIA Network+",
            "CompTIA Server+",
            "Cisco CCNA",
        ],
        project_ideas=[
            "Home lab with virtualized server cluster",
            "Network monitoring dashboard",
            "Automated backup & recovery system",
        ],
        keywords=["server", "network", "uptime", "infrastructure", "support"],
    ),
    "DATA_SCIENCE": CareerProfile(
        track="DATA_SCIENCE",
        label="Data Science",
        core_skills=[
            "python", "sql", "statistics", "pandas", "numpy",
            "data visualization", "machine learning", "scikit-learn",
            "data cleaning", "feature engineering", "tableau", "excel",
        ],
        tools=["Jupyter", "Tableau", "Power BI", "Apache Spark", "dbt"],
        certifications=[
            "Google Data Analytics Professional Certificate",
            "Microsoft Certified: Azure Data Scientist Associate",
            "IBM Data Science Professional Certificate",
        ],
        project_ideas=[
            "End-to-end EDA & dashboard on a public dataset",
            "Churn prediction model",
            "A/B test analysis report",
        ],
        keywords=["data", "analysis", "insight", "visualization", "prediction"],
    ),
    "BUSINESS_ANALYSIS": CareerProfile(
        track="BUSINESS_ANALYSIS",
        label="Business Analysis",
        core_skills=[
            "requirements gathering", "stakeholder management", "sql",
            "data analysis", "excel", "process modeling", "uml",
            "agile", "documentation", "communication", "tableau", "jira",
        ],
        tools=["Jira", "Confluence", "Tableau", "Power BI", "Visio"],
        certifications=[
            "IIBA Entry Certificate in Business Analysis (ECBA)",
            "PMI Professional in Business Analysis (PMI-PBA)",
            "Certified Scrum Product Owner (CSPO)",
        ],
        project_ideas=[
            "Business requirements document for a sample product",
            "Process improvement case study with KPIs",
            "Interactive KPI dashboard",
        ],
        keywords=["requirements", "stakeholder", "process", "kpi", "agile"],
    ),
}


# Sections expected in a complete, professional resume.
EXPECTED_SECTIONS = [
    "personal_info",
    "summary",
    "education",
    "experience",
    "projects",
    "skills",
    "certifications",
    "languages",
    "achievements",
]


def get_profile(track: str) -> CareerProfile:
    return CAREER_PROFILES.get(track, CAREER_PROFILES["SOFTWARE_ENGINEERING"])


def all_skills_for_track(track: str) -> list[str]:
    profile = get_profile(track)
    return profile.core_skills + [t.lower() for t in profile.tools]
