"""
Role-specific question banks for mock interviews.
Extracted from original interviews.py to act as a fallback when Gemini is unavailable.
"""
from __future__ import annotations

import random
from typing import TypedDict


# ── Question Bank ────────────────────────────────────────────────────────────

QUESTION_BANK: dict[str, list[str]] = {
    "Software Engineer": [
        "Explain the difference between a stack and a queue, and give a real-world use case for each.",
        "What is Big-O notation? Walk me through the time complexity of common sorting algorithms.",
        "Describe the SOLID principles and give a practical example for each.",
        "What's the difference between concurrency and parallelism? How does Python handle each?",
        "Walk me through how you would design a URL shortener like bit.ly. What data structures would you use?",
        "Explain the concept of dependency injection and how it improves testability.",
        "What is a deadlock? How would you detect and prevent it in a multi-threaded application?",
        "Describe the differences between SQL and NoSQL databases. When would you choose each?",
        "How does garbage collection work in modern languages? What are its trade-offs?",
        "Explain REST vs GraphQL. When is each a better choice?",
    ],
    "Frontend Developer": [
        "Explain the React reconciliation algorithm and how the virtual DOM works.",
        "What is the CSS Box Model? Describe each component and how they interact.",
        "How does JavaScript's event loop work? Explain the call stack, task queue, and microtask queue.",
        "What are React hooks? Explain useState, useEffect, and useCallback with real examples.",
        "Explain the difference between CSS Flexbox and Grid. When do you use each?",
        "How would you optimize a React app that's experiencing performance issues?",
        "What is Cross-Site Scripting (XSS)? How do you prevent it in a frontend app?",
        "Explain lazy loading and code splitting in React. How do they affect performance?",
        "What is the difference between localStorage, sessionStorage, and cookies?",
        "Describe your approach to making a web application accessible (WCAG guidelines).",
    ],
    "Backend Developer": [
        "Explain database indexing. When should you add an index and what are the trade-offs?",
        "What is a REST API? Describe best practices for API versioning and error handling.",
        "How does database connection pooling work and why is it important?",
        "Explain the CAP theorem and give examples of systems that prioritize each property.",
        "What are database transactions? Explain ACID properties with examples.",
        "How would you implement rate limiting in a backend API?",
        "Describe how you would set up a CI/CD pipeline for a backend service.",
        "What is message queuing? Describe how you'd use RabbitMQ or Kafka in a distributed system.",
        "Explain the difference between authentication and authorization. How do you implement JWT?",
        "Walk me through how you'd handle a sudden 10x spike in traffic to your API.",
    ],
    "Full Stack Developer": [
        "Describe a full-stack feature you've built from database schema to UI. What were the key decisions?",
        "How do you ensure consistency between your frontend and backend data models?",
        "Explain WebSockets vs HTTP long-polling for real-time applications. Which would you choose and why?",
        "How would you implement user authentication in a full-stack app with React and FastAPI?",
        "Describe how you'd approach debugging a performance issue that spans both frontend and backend.",
        "What is CORS and how do you properly configure it in a production environment?",
        "How do you manage environment configuration across development, staging, and production?",
        "Describe your approach to database migrations in a live production system.",
        "How would you design a file upload system that handles large files reliably?",
        "Explain how you'd implement real-time notifications in a web application.",
    ],
    "Data Scientist": [
        "Explain the bias-variance trade-off and how it impacts model selection.",
        "Walk me through how you would handle a dataset with 30% missing values.",
        "What is cross-validation? Why is it important and what are its different forms?",
        "Explain the difference between classification and regression. Give examples of each.",
        "What is regularization? Explain L1 (Lasso) vs L2 (Ridge) and when to use each.",
        "How would you handle class imbalance in a binary classification problem?",
        "Explain precision, recall, and F1-score. When would you prioritize one over the others?",
        "What is feature engineering? Give an example of a feature you engineered that improved model performance.",
        "Describe the difference between bagging and boosting. Give examples of each.",
        "How would you detect and handle data leakage in a machine learning pipeline?",
    ],
    "AI / ML Engineer": [
        "Explain the transformer architecture and how attention mechanisms work.",
        "What is the difference between supervised, unsupervised, and reinforcement learning?",
        "How do you evaluate a language model? What metrics would you use and why?",
        "Explain the concept of fine-tuning a pre-trained model. What are the key considerations?",
        "What is retrieval-augmented generation (RAG)? When would you use it over fine-tuning?",
        "How would you deploy a machine learning model to production at scale?",
        "Explain gradient descent and its variants (SGD, Adam, RMSProp). How do you choose between them?",
        "What is overfitting in neural networks? What techniques can you use to prevent it?",
        "Describe the challenges of working with imbalanced datasets in deep learning.",
        "How would you approach building an AI system that's fair and free of bias?",
    ],
    "DevOps Engineer": [
        "Explain the difference between Docker containers and virtual machines.",
        "Walk me through setting up a Kubernetes cluster for a production application.",
        "What is infrastructure as code? Describe your experience with Terraform or similar tools.",
        "How do you implement zero-downtime deployments?",
        "Explain the concept of service mesh and when you'd use one.",
        "Describe your approach to monitoring and observability in a microservices architecture.",
        "How would you implement a disaster recovery plan for a critical service?",
        "Explain CI/CD pipelines. What does an ideal pipeline look like for a medium-sized team?",
        "What are the key security considerations when running containers in production?",
        "How do you manage secrets and sensitive configuration in a Kubernetes environment?",
    ],
    "Cloud Architect": [
        "Describe the key differences between AWS, GCP, and Azure. How do you choose?",
        "Explain how you would architect a highly available and fault-tolerant system on the cloud.",
        "What is the Well-Architected Framework? Describe its five pillars.",
        "How would you design a multi-region database strategy for global users?",
        "Explain serverless architecture and its trade-offs compared to containerized workloads.",
        "How do you approach cloud cost optimization without sacrificing performance?",
        "Describe how you'd implement a zero-trust security model in a cloud environment.",
        "What is a service mesh and when would you deploy one on Kubernetes?",
        "How would you migrate a legacy monolithic application to a cloud-native architecture?",
        "Explain data consistency patterns in distributed cloud systems (eventual, strong, causal).",
    ],
    "Product Manager": [
        "How do you prioritize features when you have more requests than capacity?",
        "Describe a product you've launched from ideation to release. What was your process?",
        "How do you define and measure product success? What metrics matter most to you?",
        "How do you handle conflicting priorities between engineering, design, and business teams?",
        "Describe your approach to user research. What methods do you use and when?",
        "How would you decide whether to build a feature internally or use a third-party solution?",
        "Walk me through how you would run an A/B test. What are the key considerations?",
        "How do you write effective user stories? Give an example for a feature you've worked on.",
        "Describe a time a product you owned failed. What did you learn from it?",
        "How do you balance technical debt with feature development in your roadmap?",
    ],
    "UX Designer": [
        "Walk me through your design process from user research to final handoff.",
        "How do you approach designing for accessibility from the start?",
        "Describe a time user testing changed the direction of your design significantly.",
        "What is design thinking and how have you applied it in a real project?",
        "How do you balance business goals with user needs when they conflict?",
        "Explain the difference between UX and UI. How do the two roles collaborate?",
        "How do you design for multiple screen sizes and devices? What's your approach?",
        "Describe how you would redesign a confusing checkout flow. What's your process?",
        "What metrics do you use to measure the success of a UX design?",
        "How do you stay up-to-date with UX trends and best practices?",
    ],
}


# ── AI Feedback Templates ────────────────────────────────────────────────────

FEEDBACK_EXCELLENT = [
    "Excellent response! You demonstrated strong command of the subject with clear, structured thinking. Consider adding specific metrics or project outcomes to make your examples even more compelling.",
    "Outstanding answer! Your explanation was concise and technically accurate. To elevate further, you could mention edge cases or alternative approaches you considered.",
    "Great job! You showed deep understanding and communicated it clearly. Try quantifying your impact (e.g., 'reduced latency by 40%') in future interviews for extra impact.",
]

FEEDBACK_GOOD = [
    "Good answer with solid fundamentals. Your explanation covered the main points well. To improve, try structuring your response using the STAR method for more clarity.",
    "Well done! You addressed the core question effectively. Consider adding a real-world example from your experience to make your answer more memorable and concrete.",
    "A strong response overall. You demonstrated good understanding. Practice explaining trade-offs more explicitly — interviewers love when you weigh pros and cons.",
]

FEEDBACK_AVERAGE = [
    "Your answer touched on the right concepts but needed more depth. Focus on explaining *why*, not just *what*. Try to include a specific example from your experience.",
    "You're on the right track but the answer was a bit surface-level. Spend more time on the core mechanism or algorithm, and try to relate it to a real project you've worked on.",
    "Decent attempt, but the answer could be more structured. Try to start with a high-level overview, then dive into details. Practice the STAR framework for clearer storytelling.",
]

FEEDBACK_POOR = [
    "This answer needs significant improvement. Start by revisiting the core concept. Practice explaining it simply (as if to a colleague who's new to the topic), then gradually add complexity.",
    "The response missed some key aspects of the question. I'd recommend studying this topic more deeply and practicing your explanation out loud before your next interview.",
    "Your answer didn't fully address the question. Focus on understanding the fundamentals first, then work on applying them to practical scenarios from your experience.",
]

FEEDBACK_SKIPPED = "No answer was provided for this question. Practice is key — try answering every question, even if you're unsure. A partial attempt shows effort and reasoning ability."


# ── Fallback Generators ──────────────────────────────────────────────────────

class EvaluationResult(TypedDict):
    score: float
    technical_accuracy: float
    clarity_score: float
    communication_score: float
    completeness_score: float
    suggestions: str
    ideal_answer: str
    feedback: str


def get_fallback_questions(role: str, difficulty: str, interview_type: str) -> list[str]:
    """Generate mock questions when AI is unavailable."""
    bank = QUESTION_BANK.get(role, QUESTION_BANK["Software Engineer"])
    
    # Number of questions by difficulty
    counts = {"Easy": 5, "Medium": 8, "Hard": 10}
    count = counts.get(difficulty, 8)
    
    if interview_type == "HR / Behavioral":
        hr_questions = [
            "Tell me about yourself and walk me through your career journey so far.",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "Where do you see yourself in 5 years and how does this role fit your goals?",
            "Tell me about a time you had a conflict with a colleague and how you resolved it.",
            "Describe a situation where you had to learn something new quickly. How did you approach it?",
            "What's your greatest professional achievement and why does it stand out to you?",
            "Tell me about a time you failed. What did you learn from that experience?",
            "How do you prioritize when you have multiple deadlines competing for your attention?",
        ]
        return hr_questions[:count]
        
    if interview_type == "Mixed":
        technical = bank[:count // 2]
        hr_questions = [
            "Tell me about yourself and walk me through your career journey.",
            "Describe a challenging project and how you overcame obstacles.",
            "Where do you see yourself in 5 years?",
            "Tell me about a time you had to learn something new quickly.",
        ]
        mixed = technical + hr_questions[:count - len(technical)]
        random.shuffle(mixed)
        return mixed[:count]
        
    # Technical
    selected = random.sample(bank, min(count, len(bank)))
    return selected


def get_fallback_evaluation(answer: str | None) -> EvaluationResult:
    """Evaluate answer using simple heuristics when AI is unavailable."""
    if not answer or len(answer.strip()) < 20:
        return EvaluationResult(
            score=0.0,
            technical_accuracy=0.0,
            clarity_score=0.0,
            communication_score=0.0,
            completeness_score=0.0,
            suggestions="Please provide a complete answer.",
            ideal_answer="A complete answer covering all aspects of the question.",
            feedback=FEEDBACK_SKIPPED
        )
        
    length = len(answer.strip())
    
    if length > 300:
        score = round(random.uniform(7.5, 9.5), 1)
        feedback = random.choice(FEEDBACK_EXCELLENT)
    elif length > 150:
        score = round(random.uniform(6.0, 8.0), 1)
        feedback = random.choice(FEEDBACK_GOOD)
    elif length > 50:
        score = round(random.uniform(4.0, 6.5), 1)
        feedback = random.choice(FEEDBACK_AVERAGE)
    else:
        score = round(random.uniform(1.5, 4.0), 1)
        feedback = random.choice(FEEDBACK_POOR)
        
    return EvaluationResult(
        score=score,
        technical_accuracy=score,
        clarity_score=min(10.0, score + 1.0),
        communication_score=min(10.0, score + 0.5),
        completeness_score=score,
        suggestions="Try to add more specific examples and structure your answer using STAR method.",
        ideal_answer="A comprehensive response that addresses the core technical concepts and provides practical examples from experience.",
        feedback=feedback
    )
