from django.db import models
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

class Project(models.Model):
    # Project name should be unique
    project_name = models.CharField(max_length=100, unique=True)
    project_eta = models.IntegerField(blank=True, help_text="Project ETA")
    helper_text = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveSmallIntegerField(default=0)
    
    def __str__(self):
        return self.project_name
    
    ordering = ['display_order']
   
    
class ItemType(models.Model):
    text = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveSmallIntegerField(default=0)
    
    def __str__(self):
        return self.text

    ordering = ['display_order']


class WorkItem(models.Model):
    # Customer Issues, 7.0.1, 6.0.1 FP3 Email, Others etc. 
    project = models.ForeignKey(Project)
    user = models.ForeignKey(User)
    year = models.IntegerField(null=True)
    week = models.IntegerField(null=True)
    
    # ECM, Feature, Meeting/Training, Leave/Holidays, Other
    #item_type = models.CharField(max_length=50)
    item_type = models.ForeignKey(ItemType)
    item_text = models.CharField(max_length=200)
    item_comments = models.TextField(blank=True)
    item_efforts = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return '{0} | {1} | {2}'.format(self.project, self.item_type, self.item_text)
    
    
class WeekPlan(models.Model):
    user = models.ForeignKey(User)
    year = models.IntegerField(null=True)
    week = models.IntegerField(null=True)
    plan_text = models.TextField(blank=True) 
    
    def __str__(self):
        return '{0} | {1}'.format(self.user, self.plan_text)  
      
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