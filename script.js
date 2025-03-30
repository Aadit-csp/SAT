<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Realize SAT - Practice Module</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for Icons (optional but useful) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="test-interface fullscreen">
        <header class="test-header">
            <div class="header-left">
                <span id="section-module">Practice Module</span>
                <!-- Removed Directions -->
            </div>
            <div class="header-center">
                <span id="timer">--:--</span>
                <button class="control-button" id="hide-button">Hide</button> <!-- Keep Hide for now -->
            </div>
            <div class="header-right">
                 <button class="control-button icon-button"><i class="fas fa-highlighter"></i> Annotate</button>
                 <button class="control-button icon-button"><i class="fas fa-ellipsis-h"></i> More</button>
                 <!-- Removed % zoom -->
            </div>
        </header>

        <main class="test-main">
            <!-- Panels now stack vertically for potential future adjustments,
                 but will mostly behave like one continuous area with scrolling -->
            <section class="question-content-area">
                <div class="panel-controls">
                   <button class="icon-button-small"><i class="fas fa-expand-arrows-alt"></i></button>
                   <button class="icon-button-small"><i class="fas fa-book-open"></i></button>
                 </div>

                 <div class="question-prompt-area">
                    <p id="passage-text">
                        <!-- Question passage text will be loaded here -->
                    </p>
                     <div class="separator-line"></div>
                     <p class="question-prompt" id="question-prompt">
                         <!-- Question prompt will be loaded here -->
                     </p>
                </div>

                <div class="answer-options-area">
                    <div class="answer-header">
                        <span class="question-number" id="question-number-display">1</span>
                        <label class="mark-review">
                            <input type="checkbox" id="mark-review-checkbox">
                           <i class="far fa-bookmark"></i> Mark for Review
                        </label>
                       <!-- Removed ABC button -->
                    </div>
                    <ul class="answer-options" id="answer-options-list">
                        <!-- Answer options will be loaded here -->
                    </ul>
                </div>
            </section>
        </main>

        <footer class="test-footer">
            <div class="footer-left">
                Realize SAT Student
            </div>
            <div class="footer-center">
                 <!-- Removed progress bar -->
                <button class="control-button question-counter" id="question-overview-button">
                    Question 1 of -- <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="footer-right">
                 <button class="control-button prev-button" id="prev-button" disabled>Previous</button> <!-- Added Previous -->
                <button class="control-button next-button" id="next-button">Next</button>
            </div>
        </footer>

        <!-- Question Overview Modal -->
        <div class="question-overview-modal" id="question-overview-modal">
            <div class="modal-header">
                <h2>Questions</h2>
                <button id="close-modal-button">×</button>
            </div>
            <div class="modal-grid" id="modal-question-grid">
                <!-- Question number boxes will be generated here by JS -->
            </div>
             <div class="modal-legend">
                <span><span class="q-box-legend q-current"></span> Current</span>
                <span><span class="q-box-legend q-answered"></span> Answered</span>
                <span><span class="q-box-legend q-unanswered"></span> Unanswered</span>
                <span><span class="q-box-legend q-marked"><i class="fas fa-bookmark"></i></span> Marked</span>
            </div>
        </div>
        <div class="modal-backdrop" id="modal-backdrop"></div> <!-- For dimming background -->

    </div>

    <script src="test.js"></script>
</body>
</html>
