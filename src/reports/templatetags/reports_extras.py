'''
Created on 2014-06-30

@author: Michael
'''

from django import template
register = template.Library()

@register.filter
def add_attr(field, css):
    attrs = {}
    definition = css.split(',')

    for d in definition:
        if ':' not in d:
            attrs['class'] = d
        else:
            t, v = d.split(':')
            attrs[t] = v

    return field.as_widget(attrs=attrs)



@register.filter
def get_range( value ):
    """
    Filter - returns a list containing range made from given value
    Usage (in template):

    <ul>{% for i in 3|get_range %}
      <li>{{ i }}. Do something</li>
    {% endfor %}</ul>

    Results with the HTML:
    <ul>
      <li>0. Do something</li>
      <li>1. Do something</li>
      <li>2. Do something</li>
    </ul>

    Instead of 3 one may use the variable set in the views
    """
    return range(int(value))

  
    

@register.filter
def field_item_type(form, index):
    try:
        name = "item_type_" + str(index)
        return form[name]
    except:
        pass
    
@register.filter
def value_item_type(form, index):
    try:
        name = "item_type_" + str(index)
        return form[name].data
    except:
        pass
    


@register.filter
def field_item_text(form, index):
    try:
        name = "item_text_" + str(index)
        return form[name]
    except:
        pass
    
    
@register.filter
def field_item_comments(form, index):
    try:
        name = "item_comments_" + str(index)
        return form[name]
    except:
        pass
    
    
@register.filter
def field_item_comments_status(form, index):
    try:
        name = "item_comments_status_" + str(index)
        return form[name]
    except:
        pass
        
@register.filter
def field_item_efforts(form, index):
    try:
        name = "item_efforts_" + str(index)
        return form[name]
    except:
        pass
    

@register.filter
def get_item(dictionary, key):
    try:
        return dictionary.get(key)
    except:
        pass