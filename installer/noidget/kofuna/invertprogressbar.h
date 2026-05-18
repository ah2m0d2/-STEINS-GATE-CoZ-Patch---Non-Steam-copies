#pragma once

#include <QWidget>
#include <QProgressBar>
#include <QPaintEvent>

/**
 * @brief QProgressBar using background color for label text covered by progress
 *
 */
class InvertProgressBar : public QProgressBar {
    Q_OBJECT
   public:
    explicit InvertProgressBar(QWidget *parent = nullptr);
    ~InvertProgressBar();

   protected:
    void paintEvent(QPaintEvent *) Q_DECL_OVERRIDE;

   signals:

   public slots:
};