var searchFunc = function (path, kWord, content_id) {
    // 0x00. environment initialization
    'use strict';
    var $resultContent = document.getElementById(content_id);
    $resultContent.innerHTML ="<ul>首次搜索，正在载入索引文件，请稍候……(PS:如果超过1分钟这行字还在说明搜索功能已经凉了，就别候了...)</ul>";
    $.ajax({
      // 0x01. load xml file / 装载搜索用XML文档
      url: path,
      dataType: "xml",
      success: function (xmlResponse) {
        // 0x02. parse xml file
        var datas = $("entry", xmlResponse).map(function () {
          return {
            title: $("title", this).text(),
            content: $("content", this).text(),
            url: $("url", this).text(),
            categories: $("categories", this).children(),
            tags: $("tags", this).children()
          };
        }).get();
        $resultContent.innerHTML = "";
  
        // 0x03. parse query to keywords list
        var str = '<ul>';
        var keywords = kWord.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
  
        // 0x04. perform local searching
        datas.forEach(function (data) {
          var isMatch = true;
          if (!data.title || data.title.trim() === '') {
            data.title = "Untitled";
          }
          var orig_data_title = data.title.trim();
          var data_title = orig_data_title.toLowerCase();
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          var categories = "";
          data.categories.each(function() {
            categories += "{" + $(this).text() + "} ";
          });
          var tags = "";
          data.tags.each(function() {
            tags += "{" + $(this).text() + "} ";
          });
          // only match artiles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);
  
              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
              }
            });
          } else {
            isMatch = false;
          }
          // 0x05. show search results
          if (isMatch) {
            var match_title = orig_data_title;
              // highlight all keywords in title
              keywords.forEach(function (keyword) {
              var regS = new RegExp(keyword, "gi");
              match_title = match_title.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
            });
            
            str += "<li><a class='title' href='.." + data_url + "'>" + match_title + "</a>";
            str += "<span style='color:gray;display:inline-block;font-size: 80%;'>";
            str += categories ? categories : "not classified";
            str += " | ";
            str += tags ? tags : "not tagged";
            str += "</span>";
            var content = orig_data_content;
            if (first_occur >= 0) {
              // cut out 100 characters
              var start = first_occur - 20;
              var end = first_occur + 80;
  
              if (start < 0) {
                start = 0;
              }
  
              if (start == 0) {
                end = 100;
              }
  
              if (end > content.length) {
                end = content.length;
              }
  
              var match_content = content.substr(start, end);
  
              // highlight all keywords in content
              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
              });
  
              str += "<p class='content'>" + match_content + "...</p>"
            }
            str += "</li>";
          }
        });
        str += "</ul>";
        if (str.indexOf('<li>') === -1) {
          return $resultContent.innerHTML = "<ul><span class='empty'>没有找到内容，请尝试更换检索词。</span></ul>";
        }
        $resultContent.innerHTML = str;
      }
    });
    $(document).on('click', '#local-search-close', function() {
      $('#local-search-input').val('');
      $('#local-search-result').html('');
    });
  }