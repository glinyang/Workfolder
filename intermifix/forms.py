from django import forms
from reports.models import Customer_issues, Target_version_CHOICES, Status_CHOICES
from django.forms import ModelForm

class ProjectForm(forms.Form):
    project_name = forms.CharField(max_length=100, widget=forms.HiddenInput)
    
    # hidden control fields
    rows_count = forms.IntegerField(widget=forms.HiddenInput)

    def __init__(self, *args, **kwargs):
        # Note: customize arguments MUST be pop out before calling super(), else error
        # '_init__() got an unexpected keyword argument 'rows_count' will occur
        rows_count = int(kwargs.pop('rows_count'))
        super(ProjectForm, self).__init__(*args, **kwargs)
        
        for i in range(0, rows_count):
            self.fields['item_type_{0}'.format(i)] = forms.IntegerField(widget=forms.HiddenInput)
            self.fields['item_text_{0}'.format(i)] = forms.CharField(max_length=200, required=False)
            self.fields['item_comments_{0}'.format(i)] = forms.CharField(max_length=1000, required=False, widget=forms.Textarea)
            self.fields['item_comments_status_{0}'.format(i)] = forms.CharField(max_length=50, widget=forms.HiddenInput)
            self.fields['item_efforts_{0}'.format(i)] = forms.IntegerField(widget=forms.HiddenInput)
            
class IssuesForm(forms.ModelForm):
    headline = forms.CharField(required=False, widget=forms.Textarea)
    customer = forms.CharField(required=False)
    report_date = forms.CharField(required=False)
    report_by = forms.CharField(required=False)
    ecm = forms.CharField()
    target_version = forms.CharField(required=False,widget=forms.Select(choices=Target_version_CHOICES))
    modules = forms.CharField(required=False, widget=forms.Textarea )
    file_version = forms.CharField(required=False )
    package_version = forms.CharField(required=False )
    package_description = forms.CharField(required=False, widget=forms.Textarea)
    dev = forms.CharField(required=False )
    dsg = forms.CharField(required=False )
    duplicate = forms.CharField(required=False )
    qa_reject = forms.CharField(required=False )
    qa_owner = forms.CharField(required=False)
    status = forms.CharField(required=False,widget=forms.Select(choices=Status_CHOICES))
    release_date = forms.CharField(required=False)
    eta = forms.CharField(required=False, widget=forms.Textarea)
    fix_location = forms.CharField(required=False, widget=forms.Textarea)
    other_bugs = forms.CharField(required=False)
    hf_no = forms.CharField(required=False)
    fixcenterlurl = forms.CharField(required=False, widget=forms.Textarea)
    for_which_version = forms.CharField(required=False)
    cq_note = forms.CharField(required=False)
    class Meta:
        model = Customer_issues
        fields='__all__'