from django.db import models

# Create your models here.
HFTYPE_CHOICES = (('6.0.1 Fix Pack 1','6.0.1 Fix Pack 1'),
                  ('6.0.1 Fix Pack 2','6.0.1 Fix Pack 2'),
                  ('6.0.1 Fix Pack 3','6.0.1 Fix Pack 3'),
                  ('7.0 Fix Pack 1', '7.0 Fix Pack 1'),
                  ('7.0 Fix Pack 2', '7.0 Fix Pack 2'),
                  ('7.0.1', '7.0.1'),)
APPLY_CHOICES = (('Desktop','Desktop'),
                  ('Server','Server'),
                  ('Desktop/Server','Desktop/Server'),)
Environment_CHOICES = (('x64','x64'),('x86','x86'),
                       ('32-bit and 64-bit','32-bit and 64-bit'),)

class Readme(models.Model):
    hftype = models.TextField(choices=HFTYPE_CHOICES)
    hfapply = models.TextField(choices=APPLY_CHOICES)
    number = models.TextField()
    release_date = models.TextField()
    environment = models.TextField( choices=Environment_CHOICES)
    Prerequisite_Interim_fix = models.TextField()
    Bugs_Fixed = models.TextField()
    Symptoms = models.TextField()
    Cause = models.TextField()
    Resolution = models.TextField()
    Affected_Modules = models.TextField()
    Discribe = models.TextField()
    Accessories_Server=models.TextField()
    Interview_Server=models.TextField()
    Web_Server=models.TextField()
    Author_Server=models.TextField()
    Reporter_Server=models.TextField()
    Remote_Server=models.TextField()
    Survey_Server=models.TextField()

