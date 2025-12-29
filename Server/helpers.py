def convert_average_grade(avg):
    if 0 <= avg < 1.8:
        return 1
    elif 1.8 <= avg < 2.7:
        return 2
    elif 2.7 <= avg < 3.7:
        return 3
    elif 3.7 <= avg < 4.7:
        return 4
    elif 4.7 <= avg < 5.5:
        return 5
    elif 5.5 <= avg <= 6.0:
        return 6
    else:
        return "Nieprawidłowa wartość"