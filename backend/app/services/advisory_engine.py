def generate_recommendation(current_price: float, moving_average_7d: float) -> dict:
    if moving_average_7d is None or moving_average_7d == 0:
        return {"recommendation": "Not enough historical data to make a recommendation.", "confidence": "low"}
    
    percent_diff = ((current_price - moving_average_7d) / moving_average_7d) * 100
    
    if percent_diff > 5:
        return {
            "recommendation": f"Prices are {abs(percent_diff):.1f}% above the 7-day average and trending up — consider selling now to capture the premium.",
            "confidence": "high"
        }
    elif percent_diff < -5:
        return {
            "recommendation": f"Prices are {abs(percent_diff):.1f}% below the 7-day average. If storage permits, consider waiting 3-5 days for market recovery.",
            "confidence": "medium"
        }
    else:
        return {
            "recommendation": "Prices are stable and close to the 7-day average. You can sell based on your immediate cash needs.",
            "confidence": "medium"
        }
