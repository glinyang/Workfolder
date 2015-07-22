rom django.db import models
from django.contrib.auth.models import User

# Create your models here.

Target_version_CHOICES  =  (('DC 6.0.1 P1 HF','DC 6.0.1 P1 HF'),
                  ('DC 6.0.1 FP2 HF','DC 6.0.1 FP2 HF'),
                  ('DC 6.0.1 FP3 HF','DC 6.0.1 FP3 HF'),
                  ('DC 7.0 FP1 HF', 'DC 7.0 FP1 HF'),
                  ('DC 7.0 P2 HF', 'DC 7.0 P2 HF'),
                  ('DC 7.0.1 HF', 'DC 7.0.1 HF'),)

Status_CHOICES =  (('Cancel','Cancel'),
                   ('Released','Released'),
                   ('Fixing','Fixing'),
                   ('Not used','Not used'),
                   ('Rejected','Rejected'),
                   ('Testing','Testing'),
                   ('Waiting feedback','Waiting feedback'),
                  )
      
class Customer_issues(models.Model):
    headline = models.TextField(blank=True ,null=True)
    customer = models.CharField(max_length=30,blank=True ,null=True)
    report_date = models.CharField(max_length=20,blank=True ,null=True)
    report_by = models.CharField(max_length=20,blank=True ,null=True)
    ecm = models.CharField(max_length=100)
    target_version = models.CharField(choices = Target_version_CHOICES,max_length=100,blank=True ,null=True)
    modules = models.TextField(max_length=200,blank=True ,null=True)
    file_version = models.CharField(max_length=100,blank=True ,null=True)
    package_version = models.CharField(max_length=100,blank=True ,null=True)
    package_description = models.TextField(blank=True ,null=True)
    dev = models.CharField(max_length=40,blank=True ,null=True)
    dsg = models.CharField(max_length=40,blank=True ,null=True)
    duplicate = models.CharField(max_length=10,blank=True ,null=True)
    qa_reject = models.CharField(max_length=10,blank=True ,null=True)
    qa_owner = models.CharField(max_length=100,blank=True ,null=True)
    status = models.CharField(choices = Status_CHOICES,max_length=50,blank=True ,null=True)
    release_date = models.CharField(max_length=20,blank=True ,null=True)
    fix_location = models.TextField(blank=True ,null=True)
    eta = models.CharField(max_length=50,blank=True ,null=True)
    fixcenterlurl = models.TextField(blank=True ,null=True)
    other_bugs = models.TextField(blank=True ,null=True)
    hf_no = models.CharField(max_length=50,blank=True ,null=True)
    for_which_version = models.CharField(max_length=20,blank=True ,null=True)
    cq_note = models.TextField(blank=True ,null=True)
    def __str__(self):
        return self.ecm
    class Meta:
        ordering = ['ecm']
        get_latest_by = 'eta'