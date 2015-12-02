# IDE
# Assignment 3: Hands on PCA


The first part of this assignment is to give a small piece of written feedback to one of the other submissions from week 2.

Find the little square on the course homepage that corresponds to your assignment 2
Go one square left (if you have the left-most assignment then go to the far right)
Write down one thing that could be improved and one thing that was done well for that assignment
Put the assignment-number and your feedback in the course notes under the 'Student feedback' section (for instance "3: Use a narrower layout. Very cool labels on your axis.")

Many interesting datasets are multivariate (many variables) and for visualization on a 2D screen we therefore need to rely either on other visual cues than x- and y-position (for instance size, color, or shape) or we need to provide multiple views. A special type of multivariate data is high-dimensional data where the number of variables is too high for meaningful visual inspection. At the very least, it is necessary to use some kind of technique to capture the structure of the data before visualization becomes meaningful. A commonly used technique for this is principal component analysis (PCA) which repositions all data-points along orthogonal axes based on variance. The dataset has the same amount of dimensions, but now the first dimension is the one that captures the most variance, and the last dimension captures the least.

Here is a link [hands.csv] to a 112-dimensional dataset with 40 data points in it. A dimensionality of 112 is a lot, but luckily there is a lot of underlying structure (the manifold the points were taken from is low-dimensional). Each of the 40 rows represent the outline of a hand. The first 56 variables are x-coordinates of points around the hands outline and the next 56 variables are y-coordinates. Here is a link [hands_pca.csv] to the 112-dimensional dataset that you get by performing PCA on the hand set (and heres the script that generated that file [handPCA.py]). Note that the hand set is high-dimensional but has an intuitive geometric meaning while the hand-PCA set has much fewer non-zero dimensions but is mainly useful in evaluating the shape of the underlying hand-manifold.

Submit a link to a homepage which uses an interactive visualization to illustrate the connection between these two represenations and use this to interpret the data set. As a minimum, the following should be included:

1. A two-panel visualization, where one panel shows the outline of a hand and the other shows a scatter-plot of the first two variables from the PCA. When a point is activated (clicked, hovered over, selected, or so) in panel two the outline in panel one should be updated. The purpose is to connect the geometric interpretation of a data row with the multidimensional scaling provided by PCA.
2. Text surrounding the visualization which gives an intuitive description of the dataset and PCA (introduction), helps the reader navigate the visualization (methods), makes observations about the dataset (results) and extract some meaning from these observations (conclusion). We expect the last two sections to make meaningful and insightful observations.

Individual part: Each group member builds an extension of your visualization that has some interactive aspect. Add a footnote to your document that details which group member did what. Extensions with 'an interactive aspect' could be:
  
  - Display the datafile row index as a text-label or a tooltip when the mouse hovers over its point in the PCA panel.
  - Connect a piece of text in the discussion with the visualization. For example, when the mouse hovers over the discussion about an outlier, then the outlier gets highlighed in the visualization.
  - Support changing which two PCA-variables are displayed in panel two (preferably with a nice transition).
  - Display multiple hand-outlines and highlight the corresponding PCA-coordinates when one is selected
  - Add coloring based on clustering (use e.g. clusterfck)
  - Support rectangular selections in the PCA-panel (this would require one of your groupmates to implement multiple displayed outlines in the hand-panel).
  - Support interpolations between hands so even if you point to the background in the PCA-panel, a generated outline shows up in the hand-panel. (This requires you to redo the PCA and extract principal component vectors, but we can assist with that).
  - Something you think of yourself which could help illustrate PCA or helps the interpretation of the data.

As usual, extra credit is given for aesthetics and extra effort. A perfect 10 score is promised to any solution that makes a reasonable implementation of all 7 suggestions under point 3 (collaboration with attribution is still allowed).

