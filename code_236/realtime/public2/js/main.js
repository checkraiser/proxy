$(function(){

   $('input#fruits_field').smartAutoComplete({
    source: ['Trương Hoàng Dũng', 'Vũ Trọng Chiến', 'Trần Hữu Trung', 'Đỗ Văn Tuyên'],
    typeAhead: true,
     filter: function(term, source){
            var filtered_and_sorted_list =  
              $.map(source, function(item){
                var score = item.toLowerCase().score(term.toLowerCase());

                if(score > 0)
                  return { 'name': item, 'value': score }
              }).sort(function(a, b){ return b.value - a.value });

            return $.map(filtered_and_sorted_list, function(item){
              return item.name;
            });
          }
   });

  });