from django import forms
from readme.models import *
from .models import Readme
from django.forms import ModelForm

class ReadmeForm(forms.ModelForm):
    hftype = forms.CharField(required=False,widget=forms.Select(choices=HFTYPE_CHOICES))
    hfapply = forms.CharField(required=False,widget=forms.Select(choices=APPLY_CHOICES))
    number = forms.CharField(required=False,widget=forms.TextInput(attrs={'placeholder': '201'}))
    release_date = forms.CharField(required=False,widget=forms.TextInput(attrs={'placeholder': '2015  Apr.21'}))
    environment = forms.CharField(required=False,widget=forms.Select(choices=Environment_CHOICES))
    Prerequisite_Interim_fix = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'add prerequeisite HFs list here'}))
    Bugs_Fixed = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'ECM0020400 Defect headline here'}))
    Symptoms = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'Describe how the issue happens'}))
    Cause = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'Describe the reason why the issue happens'}))
    Resolution = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'Describe the fix solution here'}))
    Affected_Modules = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': '%Common Files%\IBM\SPSS\DataCollection\7\DataModel.2\.dll'}))
    Discribe = forms.CharField(required=False,widget=forms.Textarea(attrs={'cols':'90','rows':'4','placeholder': 'xxx.dll   6.0.103.146   30-April-2015   11:31PM   x64'}))
    Accessories_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Interview_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Web_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Author_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Reporter_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Remote_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    Survey_Server=forms.CharField(required=False,widget=forms.CheckboxInput())
    class Meta :
        model = Readme
        fields='__all__'