import os
from openai import OpenAI
from core.config import settings
import json

def generate_insights(stats: dict, schema_info: list) -> list:
    """
    Generates business insights based on the statistical profile of the dataset.
    Falls back to mock insights if OPENAI_API_KEY is not set or is 'mock'.
    """
    api_key = settings.OPENAI_API_KEY
    
    if not api_key or api_key == "mock":
        return get_mock_insights(stats)
        
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"""
        Analyze the following dataset profile and provide 3 key business insights.
        Format your response as a JSON array of strings.
        
        Dataset Schema: {json.dumps(schema_info)}
        Statistics: {json.dumps(stats)}
        
        Respond ONLY with a JSON array like: ["insight 1", "insight 2", "insight 3"]
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert data analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        insights = json.loads(content)
        return insights
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        return get_mock_insights(stats)

def get_mock_insights(stats: dict) -> list:
    revenue = stats.get("business_stats", {}).get("total_revenue", 0)
    
    insights = [
        f"The dataset contains {stats.get('rows', 0):,} rows and {stats.get('columns', 0)} columns with {stats.get('missing_percent', 0):.1f}% missing data.",
    ]
    
    if revenue > 0:
        insights.append(f"Total revenue identified is approximately ${revenue:,.2f}.")
        insights.append("Revenue shows fluctuations over the observed period. Consider investigating regional performance to identify drivers.")
    else:
        insights.append("No clear revenue metrics were identified. Ensure the dataset contains 'sales' or 'revenue' columns for financial analysis.")
        insights.append(f"Data quality is generally good, with {stats.get('duplicates', 0)} duplicate rows detected.")
        
    return insights
