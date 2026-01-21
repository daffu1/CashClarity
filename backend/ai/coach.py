import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get API key from environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_budget_advice(transaction_summary: str) -> str:
    prompt = f"""
    A user has provided the following summary of their recent spending:

    {transaction_summary}

    Please provide helpful and friendly financial advice that could help them save money, identify spending patterns, and offer budget tips. Keep the tone conversational and clear.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("OpenAI API error:", e)
        return "An error occurred while generating advice."
