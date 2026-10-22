## Functions

<dl>
<dt><a href="#splitting">splitting(expression)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Разбивает исходное выражение на простейшие компоненты</p>
<p>Логические операторы и скобки выделяются отдельно
Сравнения и другие операнды выделяются отдельно</p>
</dd>
<dt><a href="#parseExpression">parseExpression(expression)</a> ⇒ <code><a href="#ParseResult">ParseResult</a></code></dt>
<dd><p>Запускает синтаксический разбор выражения и проверяет, что все составляющие части обработаны</p>
</dd>
<dt><a href="#parsePrimary">parsePrimary(parts, curIndex)</a> ⇒ <code><a href="#ParseResult">ParseResult</a></code></dt>
<dd><p>Разбирает первый приоритет: операнды и константы или выражения в скобках</p>
</dd>
<dt><a href="#parseUnary">parseUnary(parts, curIndex)</a> ⇒ <code><a href="#ParseResult">ParseResult</a></code></dt>
<dd><p>Разбирает унарное логическое выражение</p>
</dd>
<dt><a href="#parseAnd">parseAnd(parts, curIndex)</a> ⇒ <code><a href="#ParseResult">ParseResult</a></code></dt>
<dd><p>Разбирает логическое выражение из последовательности операций логического И</p>
</dd>
<dt><a href="#parseOr">parseOr(parts, curIndex)</a> ⇒ <code><a href="#ParseResult">ParseResult</a></code></dt>
<dd><p>Разбирает логическое выражение из последовательности операций логического ИЛИ</p>
</dd>
<dt><a href="#isEqual">isEqual(a, b)</a> ⇒ <code>boolean</code></dt>
<dd><p>Проверяет равенство двух узлов дерева</p>
</dd>
<dt><a href="#isNegativeOf">isNegativeOf(a, b)</a> ⇒ <code>boolean</code></dt>
<dd><p>Проверяет является ли один узел отрицанием другого</p>
</dd>
<dt><a href="#simplifyNode">simplifyNode(node)</a> ⇒ <code><a href="#Node">Node</a></code></dt>
<dd><p>Упрощает дерево с помощью законов булевой алгебры: нейтральный элемент,
поглощение константой, двойное отрицание, идемпотентность, противоречие,
исключенное третье, законы де Моргана, законы поглощения.</p>
</dd>
<dt><a href="#nodeToExpression">nodeToExpression(node, [parentPriority])</a> ⇒ <code>string</code></dt>
<dd><p>Преобразует дерево в текст логического выражения.
Учитывает приоритеты операторов.</p>
</dd>
<dt><a href="#activate">activate(context)</a> ⇒ <code>void</code></dt>
<dd><p>Активирует расширение VS Code и регистрирует команду упрощения
логического выражения.</p>
</dd>
<dt><a href="#deactivate">deactivate()</a> ⇒ <code>void</code></dt>
<dd><p>Деактивирует расширение</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#curIndex">curIndex</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Node">Node</a> : <code>Object</code></dt>
<dd><p>Узел дерева логического выражения</p>
<p>Типы узлов:
operand - неделимый операнд
constant - логическая константа
not - логическое отрицание
and - логическое И
or - логическое ИЛИ</p>
</dd>
<dt><a href="#ParseResult">ParseResult</a> : <code>object</code></dt>
<dd><p>Результаты разбора выражения</p>
</dd>
</dl>

<a name="splitting"></a>

## splitting(expression) ⇒ <code>Array.&lt;string&gt;</code>
Разбивает исходное выражение на простейшие компоненты

Логические операторы и скобки выделяются отдельно
Сравнения и другие операнды выделяются отдельно

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - Массив компонент  

| Param | Type | Description |
| --- | --- | --- |
| expression | <code>string</code> | Выделенное пользователем выражение |

<a name="parseExpression"></a>

## parseExpression(expression) ⇒ [<code>ParseResult</code>](#ParseResult)
Запускает синтаксический разбор выражения и проверяет, что все составляющие части обработаны

**Kind**: global function  
**Returns**: [<code>ParseResult</code>](#ParseResult) - результат разбора  

| Param | Type | Description |
| --- | --- | --- |
| expression | <code>string</code> | Выделенное пользователем выражение |

<a name="parsePrimary"></a>

## parsePrimary(parts, curIndex) ⇒ [<code>ParseResult</code>](#ParseResult)
Разбирает первый приоритет: операнды и константы или выражения в скобках

**Kind**: global function  
**Returns**: [<code>ParseResult</code>](#ParseResult) - Результат парсинга элемента  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>Array.&lt;string&gt;</code> | Массив компонент |
| curIndex | [<code>curIndex</code>](#curIndex) | Текущий индекс парсинга |

<a name="parseUnary"></a>

## parseUnary(parts, curIndex) ⇒ [<code>ParseResult</code>](#ParseResult)
Разбирает унарное логическое выражение

**Kind**: global function  
**Returns**: [<code>ParseResult</code>](#ParseResult) - Результат парсинга  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>Array.&lt;string&gt;</code> | Массив компонент |
| curIndex | [<code>curIndex</code>](#curIndex) | Текущий индекс парсинга |

<a name="parseAnd"></a>

## parseAnd(parts, curIndex) ⇒ [<code>ParseResult</code>](#ParseResult)
Разбирает логическое выражение из последовательности операций логического И

**Kind**: global function  
**Returns**: [<code>ParseResult</code>](#ParseResult) - Результат парсинга  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>Array.&lt;string&gt;</code> | Массив компонент |
| curIndex | [<code>curIndex</code>](#curIndex) | Текущий индекс парсинга |

<a name="parseOr"></a>

## parseOr(parts, curIndex) ⇒ [<code>ParseResult</code>](#ParseResult)
Разбирает логическое выражение из последовательности операций логического ИЛИ

**Kind**: global function  
**Returns**: [<code>ParseResult</code>](#ParseResult) - Результат парсинга  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>Array.&lt;string&gt;</code> | Массив компонент |
| curIndex | [<code>curIndex</code>](#curIndex) | Текущий индекс парсинга |

<a name="isEqual"></a>

## isEqual(a, b) ⇒ <code>boolean</code>
Проверяет равенство двух узлов дерева

**Kind**: global function  
**Returns**: <code>boolean</code> - Результат проверки равенства узлов  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Node</code>](#Node) | Первый узел дерева |
| b | [<code>Node</code>](#Node) | Второй узел дерева |

<a name="isNegativeOf"></a>

## isNegativeOf(a, b) ⇒ <code>boolean</code>
Проверяет является ли один узел отрицанием другого

**Kind**: global function  
**Returns**: <code>boolean</code> - Результат проверки: true, если узлы представляют a и !a  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Node</code>](#Node) | Первый узел дерева |
| b | [<code>Node</code>](#Node) | Второй узел дерева |

<a name="simplifyNode"></a>

## simplifyNode(node) ⇒ [<code>Node</code>](#Node)
Упрощает дерево с помощью законов булевой алгебры: нейтральный элемент,
поглощение константой, двойное отрицание, идемпотентность, противоречие,
исключенное третье, законы де Моргана, законы поглощения.

**Kind**: global function  
**Returns**: [<code>Node</code>](#Node) - Упрощённое поддерево  

| Param | Type | Description |
| --- | --- | --- |
| node | [<code>Node</code>](#Node) | Корень обрабатываемого поддерева |

<a name="nodeToExpression"></a>

## nodeToExpression(node, [parentPriority]) ⇒ <code>string</code>
Преобразует дерево в текст логического выражения.
Учитывает приоритеты операторов.

**Kind**: global function  
**Returns**: <code>string</code> - Текстовое представление логического выражения  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node | [<code>Node</code>](#Node) |  | Корень преобразуемого дерева |
| [parentPriority] | <code>number</code> | <code>5</code> | Приоритет родительской операции |

<a name="activate"></a>

## activate(context) ⇒ <code>void</code>
Активирует расширение VS Code и регистрирует команду упрощения
логического выражения.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>vscode.ExtensionContext</code> | Контекст расширения |

<a name="deactivate"></a>

## deactivate() ⇒ <code>void</code>
Деактивирует расширение

**Kind**: global function  
<a name="curIndex"></a>

## curIndex : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Index | <code>number</code> | Индекс следующей компоненты для обработки |

<a name="Node"></a>

## Node : <code>Object</code>
Узел дерева логического выражения

Типы узлов:
operand - неделимый операнд
constant - логическая константа
not - логическое отрицание
and - логическое И
or - логическое ИЛИ

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;operand&#x27;</code> \| <code>&#x27;constant&#x27;</code> \| <code>&#x27;not&#x27;</code> \| <code>&#x27;and&#x27;</code> \| <code>&#x27;or&#x27;</code> | Тип узла |
| [value] | <code>string</code> \| <code>boolean</code> | Значение операнда или константы |
| [child] | [<code>Node</code>](#Node) | Дочерний узел логического отрицания |
| [left] | [<code>Node</code>](#Node) | Левый дочерний узел |
| [right] | [<code>Node</code>](#Node) | Правый дочерний узел |

<a name="ParseResult"></a>

## ParseResult : <code>object</code>
Результаты разбора выражения

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ok | <code>boolean</code> | Показатель успешного/неуспешного разбора |
| [node] | [<code>Node</code>](#Node) | Новый узел при успешном разборе |

