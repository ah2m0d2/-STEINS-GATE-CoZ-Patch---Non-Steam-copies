#include "invertprogressbar.h"
#include <QStyle>
#include <QStylePainter>
#include <QStyleOptionProgressBar>

InvertProgressBar::InvertProgressBar(QWidget *parent) : QProgressBar(parent) {}

InvertProgressBar::~InvertProgressBar() {}

void InvertProgressBar::paintEvent(QPaintEvent *ev) {
    QStylePainter paint(this);
    QStyleOptionProgressBar opt;
    initStyleOption(&opt);

    paint.drawControl(QStyle::CE_ProgressBarGroove, opt);
    paint.drawControl(QStyle::CE_ProgressBarContents, opt);

    const QStyleOptionProgressBar *option = &opt;
    QStylePainter *painter = &paint;

    // Stolen from QFusionStyle::drawControl
    if (const QStyleOptionProgressBar *bar =
            qstyleoption_cast<const QStyleOptionProgressBar *>(option)) {
        QRect leftRect;
        QRect rect = bar->rect;
        QColor textColor = option->palette.text().color();
        QColor alternateTextColor = option->palette.background().color();

        painter->save();
        bool vertical = false, inverted = false;
        vertical = (bar->orientation == Qt::Vertical);
        inverted = bar->invertedAppearance;
        if (vertical)
            rect = QRect(rect.left(), rect.top(), rect.height(),
                         rect.width());  // flip width and height
        const auto totalSteps =
            qMax(Q_INT64_C(1), qint64(bar->maximum) - bar->minimum);
        const auto progressSteps = qint64(bar->progress) - bar->minimum;
        const auto progressIndicatorPos =
            progressSteps * rect.width() / totalSteps;
        if (progressIndicatorPos >= 0 && progressIndicatorPos <= rect.width())
            leftRect = QRect(rect.left(), rect.top(), progressIndicatorPos,
                             rect.height());
        if (vertical)
            leftRect.translate(rect.width() - progressIndicatorPos, 0);

        bool flip =
            (!vertical && (((bar->direction == Qt::RightToLeft) && !inverted) ||
                           ((bar->direction == Qt::LeftToRight) && inverted)));

        QRegion rightRect = rect;
        rightRect = rightRect.subtracted(leftRect);
        painter->setClipRegion(rightRect);
        painter->setPen(flip ? alternateTextColor : textColor);
        painter->drawText(rect, bar->text,
                          QTextOption(Qt::AlignAbsolute | Qt::AlignHCenter |
                                      Qt::AlignVCenter));
        if (!leftRect.isNull()) {
            painter->setPen(flip ? textColor : alternateTextColor);
            painter->setClipRect(leftRect);
            painter->drawText(rect, bar->text,
                              QTextOption(Qt::AlignAbsolute | Qt::AlignHCenter |
                                          Qt::AlignVCenter));
        }
        painter->restore();
    }
}
