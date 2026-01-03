# Dictionary containing crop requirements
# Format:
# 'CropName': {
#     'nitrogen': (min, max),
#     'phosphorus': (min, max),
#     'potassium': (min, max),
#     'ph': (min, max),
#     'temperature': (min, max),
#     'humidity': (min, max),
#     'rainfall': (min, max)
# }

CROPS_DATA = {
    # Example data (Values need to be verified with agricultural standards)
    'Rice': {
        'nitrogen': (60, 100),
        'phosphorus': (30, 60),
        'potassium': (30, 45),
        'ph': (5.0, 7.5),
        'temperature': (20, 35),
        'humidity': (70, 100),
        'rainfall': (1000, 3000) # mm per year/season ?? Need to standardize time period
    },
    'Wheat': {
        'nitrogen': (40, 60),
        'phosphorus': (20, 40),
        'potassium': (20, 30),
        'ph': (6.0, 7.5),
        'temperature': (10, 25),
        'humidity': (50, 70),
        'rainfall': (400, 1000)
    }
}
